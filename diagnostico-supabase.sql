-- =====================================================
-- 🔍 DIAGNÓSTICO: Ver estructura de tu base de datos
-- =====================================================
-- Ejecuta esto PRIMERO para ver cómo están tus tablas
-- =====================================================

-- 1. VER TODAS LAS COLUMNAS DE LA TABLA PROJECTS
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'projects'
ORDER BY ordinal_position;

-- 2. VER TODAS LAS TABLAS QUE TIENES
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('clients', 'projects', 'messages', 'notifications', 
                        'payments', 'meetings', 'budgets', 'documents', 
                        'users', 'activity_logs', 'modificaciones')
    THEN '✅ Necesaria'
    ELSE '❓ Extra'
  END as estado
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 3. VER FOREIGN KEYS (relaciones)
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- 4. VER ÍNDICES EXISTENTES
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- =====================================================
-- 🎯 RESULTADO ESPERADO
-- =====================================================
-- Esto te va a mostrar:
-- 1. Cómo se llama exactamente la columna (cliente_id o client_id)
-- 2. Qué tablas tienes
-- 3. Qué relaciones existen
-- 4. Qué índices ya tienes
--
-- Con esta info podemos crear el script correcto
-- =====================================================
