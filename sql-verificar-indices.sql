-- =====================================================
-- SCRIPT DE VERIFICACIÓN DE ÍNDICES
-- VM Studio - Verificar estado de optimización
-- =====================================================

-- =====================================================
-- 1. VERIFICAR ÍNDICES EXISTENTES
-- =====================================================

SELECT 
    schemaname AS schema,
    tablename AS tabla,
    indexname AS indice,
    indexdef AS definicion,
    pg_size_pretty(pg_relation_size(indexrelid)) AS tamaño
FROM 
    pg_stat_user_indexes
WHERE 
    schemaname = 'public'
ORDER BY 
    tablename, indexname;

-- =====================================================
-- 2. VERIFICAR USO DE ÍNDICES (Performance)
-- =====================================================

-- Muestra qué tan frecuentemente se usan los índices
SELECT
    schemaname AS schema,
    tablename AS tabla,
    indexname AS indice,
    idx_scan AS veces_usado,
    idx_tup_read AS tuplas_leidas,
    idx_tup_fetch AS tuplas_obtenidas,
    pg_size_pretty(pg_relation_size(indexrelid)) AS tamaño
FROM
    pg_stat_user_indexes
WHERE
    schemaname = 'public'
ORDER BY
    idx_scan DESC;

-- =====================================================
-- 3. ÍNDICES NO USADOS (Candidatos para eliminar)
-- =====================================================

-- Índices que nunca se han usado (posible desperdicio)
SELECT
    schemaname AS schema,
    tablename AS tabla,
    indexname AS indice,
    pg_size_pretty(pg_relation_size(indexrelid)) AS tamaño,
    'NUNCA USADO - Considerar eliminar' AS nota
FROM
    pg_stat_user_indexes
WHERE
    schemaname = 'public'
    AND idx_scan = 0
    AND indexname NOT LIKE '%_pkey'  -- Excluir primary keys
ORDER BY
    pg_relation_size(indexrelid) DESC;

-- =====================================================
-- 4. VERIFICAR TABLAS SIN ÍNDICES
-- =====================================================

-- Tablas que podrían necesitar índices
SELECT
    tablename AS tabla,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS tamaño_total,
    n_live_tup AS filas_aprox,
    CASE 
        WHEN n_live_tup > 10000 THEN '⚠️ Considerar índices adicionales'
        WHEN n_live_tup > 1000 THEN '✅ Revisar queries frecuentes'
        ELSE '✅ OK para tablas pequeñas'
    END AS recomendacion
FROM
    pg_stat_user_tables
WHERE
    schemaname = 'public'
ORDER BY
    n_live_tup DESC;

-- =====================================================
-- 5. VERIFICAR COLUMNAS QUE NECESITAN ÍNDICES
-- =====================================================

-- Queries más lentas (requiere pg_stat_statements extension)
-- Activar con: CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

/*
SELECT
    substring(query, 1, 100) AS query_preview,
    calls AS veces_ejecutada,
    round(total_exec_time::numeric, 2) AS tiempo_total_ms,
    round(mean_exec_time::numeric, 2) AS tiempo_promedio_ms,
    round((100 * total_exec_time / sum(total_exec_time) OVER ())::numeric, 2) AS porcentaje_tiempo
FROM
    pg_stat_statements
WHERE
    query NOT LIKE '%pg_stat_statements%'
ORDER BY
    total_exec_time DESC
LIMIT 20;
*/

-- =====================================================
-- 6. VERIFICAR FOREIGN KEYS CON ÍNDICES
-- =====================================================

-- Foreign keys SIN índice (problema de performance común)
SELECT
    tc.table_name AS tabla,
    kcu.column_name AS columna_fk,
    ccu.table_name AS tabla_referenciada,
    CASE 
        WHEN i.indexname IS NULL THEN '❌ SIN ÍNDICE - Crear urgente'
        ELSE '✅ Tiene índice: ' || i.indexname
    END AS estado
FROM
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu 
        ON ccu.constraint_name = tc.constraint_name
    LEFT JOIN pg_indexes i 
        ON i.tablename = tc.table_name 
        AND i.indexdef LIKE '%' || kcu.column_name || '%'
WHERE
    tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY
    tc.table_name, kcu.column_name;

-- =====================================================
-- 7. TAMAÑO DE TABLAS E ÍNDICES
-- =====================================================

SELECT
    tablename AS tabla,
    pg_size_pretty(pg_table_size(schemaname||'.'||tablename)) AS tamaño_tabla,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) AS tamaño_indices,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS tamaño_total,
    round(100 * pg_indexes_size(schemaname||'.'||tablename)::numeric / 
        NULLIF(pg_total_relation_size(schemaname||'.'||tablename), 0), 2) AS porcentaje_indices
FROM
    pg_tables
WHERE
    schemaname = 'public'
ORDER BY
    pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- =====================================================
-- 8. VERIFICAR ESTADÍSTICAS ACTUALIZADAS
-- =====================================================

-- Tablas con estadísticas desactualizadas (afecta query planner)
SELECT
    schemaname AS schema,
    tablename AS tabla,
    last_vacuum AS ultimo_vacuum,
    last_autovacuum AS ultimo_autovacuum,
    last_analyze AS ultimo_analyze,
    last_autoanalyze AS ultimo_autoanalyze,
    n_live_tup AS filas_vivas,
    n_dead_tup AS filas_muertas,
    CASE 
        WHEN last_analyze < NOW() - INTERVAL '7 days' THEN '⚠️ Ejecutar ANALYZE'
        WHEN last_analyze < NOW() - INTERVAL '1 day' THEN '✅ OK, pero revisar'
        ELSE '✅ Actualizado recientemente'
    END AS estado
FROM
    pg_stat_user_tables
WHERE
    schemaname = 'public'
ORDER BY
    last_analyze NULLS FIRST;

-- =====================================================
-- 9. VERIFICAR BLOAT (Espacio desperdiciado)
-- =====================================================

-- Tablas con mucho bloat (espacio no utilizado)
SELECT
    schemaname AS schema,
    tablename AS tabla,
    pg_size_pretty(pg_table_size(schemaname||'.'||tablename)) AS tamaño,
    n_dead_tup AS filas_muertas,
    CASE 
        WHEN n_dead_tup::float / NULLIF(n_live_tup, 0) > 0.2 THEN '⚠️ Ejecutar VACUUM FULL'
        WHEN n_dead_tup::float / NULLIF(n_live_tup, 0) > 0.1 THEN '⚠️ Considerar VACUUM'
        ELSE '✅ OK'
    END AS recomendacion
FROM
    pg_stat_user_tables
WHERE
    schemaname = 'public'
    AND n_live_tup > 0
ORDER BY
    (n_dead_tup::float / NULLIF(n_live_tup, 0)) DESC;

-- =====================================================
-- 10. ÍNDICES DUPLICADOS O REDUNDANTES
-- =====================================================

-- Buscar índices que cubren las mismas columnas
SELECT
    a.indexname AS indice_1,
    b.indexname AS indice_2,
    a.tablename AS tabla,
    '⚠️ Posible duplicado - Revisar' AS nota
FROM
    pg_indexes a
    JOIN pg_indexes b 
        ON a.tablename = b.tablename 
        AND a.indexname < b.indexname
        AND a.indexdef = b.indexdef
WHERE
    a.schemaname = 'public';

-- =====================================================
-- 11. VERIFICAR ÍNDICES PARCIALES
-- =====================================================

-- Listar índices parciales (con WHERE clause)
SELECT
    schemaname AS schema,
    tablename AS tabla,
    indexname AS indice,
    indexdef AS definicion,
    '✅ Índice parcial optimizado' AS tipo
FROM
    pg_indexes
WHERE
    schemaname = 'public'
    AND indexdef LIKE '%WHERE%'
ORDER BY
    tablename, indexname;

-- =====================================================
-- 12. RESUMEN EJECUTIVO
-- =====================================================

-- Dashboard de salud de índices
SELECT
    COUNT(*) AS total_indices,
    COUNT(*) FILTER (WHERE idx_scan > 0) AS indices_usados,
    COUNT(*) FILTER (WHERE idx_scan = 0 AND indexname NOT LIKE '%_pkey') AS indices_sin_usar,
    pg_size_pretty(SUM(pg_relation_size(indexrelid))) AS tamaño_total_indices,
    round(AVG(idx_scan)) AS promedio_uso
FROM
    pg_stat_user_indexes
WHERE
    schemaname = 'public';

-- =====================================================
-- COMANDOS DE MANTENIMIENTO
-- =====================================================

-- Ejecutar si se encuentran problemas:

-- Actualizar estadísticas de todas las tablas
-- ANALYZE;

-- Limpiar espacio en una tabla específica
-- VACUUM FULL tabla_nombre;

-- Recrear índice corrupto
-- REINDEX INDEX nombre_indice;

-- Recrear todos los índices de una tabla
-- REINDEX TABLE nombre_tabla;

-- =====================================================
-- NOTAS DE INTERPRETACIÓN
-- =====================================================

/*
INTERPRETACIÓN DE RESULTADOS:

1. idx_scan = 0: El índice nunca se ha usado
   - Si es reciente, esperar
   - Si es antiguo, considerar eliminar

2. n_dead_tup alto: Muchas filas muertas
   - Ejecutar VACUUM
   - Revisar autovacuum settings

3. Foreign keys sin índice: Problema crítico
   - Crear índice inmediatamente
   - Mejorará JOINs y DELETEs

4. Índices grandes no usados: Desperdicio
   - Ocupan espacio
   - Ralentizan INSERTs/UPDATEs
   - Eliminar si no son necesarios

5. Estadísticas viejas: Query planner subóptimo
   - Ejecutar ANALYZE
   - Revisar autovacuum

FRECUENCIA RECOMENDADA:
- Desarrollo: Semanal
- Staging: Diaria
- Producción: Cada hora (automatizado)
*/

-- =====================================================
-- FIN DE VERIFICACIÓN
-- =====================================================
