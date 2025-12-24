-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN DE RENDIMIENTO
-- VM Studio - Base de Datos
-- =====================================================

-- IMPORTANTE: Ejecutar estos índices mejorará dramáticamente
-- el rendimiento de las queries frecuentes

-- =====================================================
-- TABLA: clients
-- =====================================================

-- Índice para búsquedas por email (login, búsquedas)
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- Índice para búsquedas por teléfono
CREATE INDEX IF NOT EXISTS idx_clients_telefono ON clients(telefono);

-- Índice para ordenar por nombre
CREATE INDEX IF NOT EXISTS idx_clients_nombre ON clients(nombre);

-- Índice compuesto para búsquedas activas
CREATE INDEX IF NOT EXISTS idx_clients_active_created 
ON clients(id, created_at) 
WHERE deleted_at IS NULL;

-- =====================================================
-- TABLA: projects
-- =====================================================

-- Índice para buscar proyectos por cliente (query MUY frecuente)
CREATE INDEX IF NOT EXISTS idx_projects_cliente_id ON projects(cliente_id);

-- Índice para buscar por código de proyecto (acceso de clientes)
CREATE INDEX IF NOT EXISTS idx_projects_codigo ON projects(codigo);

-- Índice para ordenar por fecha de inicio
CREATE INDEX IF NOT EXISTS idx_projects_fecha_inicio ON projects(fecha_inicio DESC);

-- Índice para ordenar por avance
CREATE INDEX IF NOT EXISTS idx_projects_avance ON projects(avance);

-- Índice compuesto para dashboard (cliente_id + fecha + avance)
CREATE INDEX IF NOT EXISTS idx_projects_cliente_fecha_avance 
ON projects(cliente_id, fecha_inicio DESC, avance);

-- Índice para búsqueda de texto en nombre
CREATE INDEX IF NOT EXISTS idx_projects_nombre_text 
ON projects USING gin(to_tsvector('spanish', nombre));

-- =====================================================
-- TABLA: messages
-- =====================================================

-- Índice para obtener mensajes por proyecto (query MUY frecuente)
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);

-- Índice para ordenar por timestamp
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);

-- Índice compuesto para mensajes no leídos por proyecto
CREATE INDEX IF NOT EXISTS idx_messages_project_unread 
ON messages(project_id, read, timestamp DESC);

-- Índice para contar mensajes no leídos por sender
CREATE INDEX IF NOT EXISTS idx_messages_sender_read 
ON messages(sender, read) WHERE read = false;

-- =====================================================
-- TABLA: payments
-- =====================================================

-- Índice para pagos por proyecto
CREATE INDEX IF NOT EXISTS idx_payments_project_id ON payments(project_id);

-- Índice para pagos por estado (pendiente, pagado, vencido)
CREATE INDEX IF NOT EXISTS idx_payments_estado ON payments(estado);

-- Índice para pagos por fecha de vencimiento
CREATE INDEX IF NOT EXISTS idx_payments_fecha_vencimiento 
ON payments(fecha_vencimiento);

-- Índice compuesto para pagos pendientes por vencer
CREATE INDEX IF NOT EXISTS idx_payments_pending_due 
ON payments(estado, fecha_vencimiento) 
WHERE estado = 'pendiente';

-- =====================================================
-- TABLA: notifications
-- =====================================================

-- Índice para notificaciones por usuario
CREATE INDEX IF NOT EXISTS idx_notifications_usuario_id 
ON notifications(usuario_id);

-- Índice para notificaciones no leídas
CREATE INDEX IF NOT EXISTS idx_notifications_leido 
ON notifications(leido) WHERE leido = false;

-- Índice compuesto para notificaciones por usuario no leídas
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
ON notifications(usuario_id, leido, created_at DESC) 
WHERE leido = false;

-- Índice por tipo de notificación
CREATE INDEX IF NOT EXISTS idx_notifications_tipo ON notifications(tipo);

-- =====================================================
-- TABLA: meetings
-- =====================================================

-- Índice para meetings por proyecto
CREATE INDEX IF NOT EXISTS idx_meetings_proyecto_id ON meetings(proyecto_id);

-- Índice para meetings por cliente
CREATE INDEX IF NOT EXISTS idx_meetings_cliente_id ON meetings(cliente_id);

-- Índice para meetings por fecha
CREATE INDEX IF NOT EXISTS idx_meetings_fecha_hora ON meetings(fecha_hora);

-- Índice compuesto para próximas reuniones
CREATE INDEX IF NOT EXISTS idx_meetings_upcoming 
ON meetings(fecha_hora) 
WHERE fecha_hora > NOW();

-- =====================================================
-- TABLA: budgets
-- =====================================================

-- Índice para presupuestos por proyecto
CREATE INDEX IF NOT EXISTS idx_budgets_proyecto_id ON budgets(proyecto_id);

-- Índice para presupuestos por cliente
CREATE INDEX IF NOT EXISTS idx_budgets_cliente_id ON budgets(cliente_id);

-- Índice por estado
CREATE INDEX IF NOT EXISTS idx_budgets_estado ON budgets(estado);

-- Índice compuesto para presupuestos activos
CREATE INDEX IF NOT EXISTS idx_budgets_active 
ON budgets(estado, created_at DESC) 
WHERE estado IN ('pendiente', 'aprobado');

-- =====================================================
-- TABLA: documents
-- =====================================================

-- Índice para documentos por proyecto
CREATE INDEX IF NOT EXISTS idx_documents_proyecto_id ON documents(proyecto_id);

-- Índice para documentos por cliente
CREATE INDEX IF NOT EXISTS idx_documents_cliente_id ON documents(cliente_id);

-- Índice por categoría
CREATE INDEX IF NOT EXISTS idx_documents_categoria ON documents(categoria);

-- Índice por tipo de archivo
CREATE INDEX IF NOT EXISTS idx_documents_tipo_archivo ON documents(tipo_archivo);

-- =====================================================
-- TABLA: users
-- =====================================================

-- Índice para login por username (query CRÍTICA)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Índice para buscar por email
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Índice por rol
CREATE INDEX IF NOT EXISTS idx_users_rol ON users(rol);

-- Índice para usuarios activos
CREATE INDEX IF NOT EXISTS idx_users_activo 
ON users(activo, ultimo_acceso DESC) 
WHERE activo = true;

-- =====================================================
-- TABLA: sessions
-- =====================================================

-- Índice para sessions por usuario
CREATE INDEX IF NOT EXISTS idx_sessions_usuario_id ON sessions(usuario_id);

-- Índice para sessions por cliente
CREATE INDEX IF NOT EXISTS idx_sessions_cliente_id ON sessions(cliente_id);

-- Índice para sessions activas
CREATE INDEX IF NOT EXISTS idx_sessions_activo 
ON sessions(activo, ultimo_acceso DESC) 
WHERE activo = true;

-- =====================================================
-- TABLA: activity_logs
-- =====================================================

-- Índice para logs por usuario
CREATE INDEX IF NOT EXISTS idx_activity_logs_usuario_id 
ON activity_logs(usuario_id);

-- Índice por tabla afectada
CREATE INDEX IF NOT EXISTS idx_activity_logs_tabla 
ON activity_logs(tabla_afectada);

-- Índice por fecha de creación (para limpiezas periódicas)
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at 
ON activity_logs(created_at DESC);

-- Índice compuesto para auditoría
CREATE INDEX IF NOT EXISTS idx_activity_logs_audit 
ON activity_logs(tabla_afectada, registro_id, created_at DESC);

-- =====================================================
-- ESTADÍSTICAS Y MANTENIMIENTO
-- =====================================================

-- Actualizar estadísticas de las tablas para el query planner
ANALYZE clients;
ANALYZE projects;
ANALYZE messages;
ANALYZE payments;
ANALYZE notifications;
ANALYZE meetings;
ANALYZE budgets;
ANALYZE documents;
ANALYZE users;
ANALYZE sessions;
ANALYZE activity_logs;

-- =====================================================
-- CONFIGURACIÓN DE AUTOVACUUM
-- =====================================================

-- Para tablas con muchas actualizaciones, ajustar autovacuum
ALTER TABLE messages SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);

ALTER TABLE notifications SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);

ALTER TABLE activity_logs SET (
  autovacuum_vacuum_scale_factor = 0.2,
  autovacuum_analyze_scale_factor = 0.1
);

-- =====================================================
-- VERIFICACIÓN DE ÍNDICES
-- =====================================================

-- Query para verificar el tamaño de los índices
-- Ejecutar después de crear para verificar
/*
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM
  pg_stat_user_indexes
WHERE
  schemaname = 'public'
ORDER BY
  pg_relation_size(indexrelid) DESC;
*/

-- Query para verificar uso de índices
/*
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM
  pg_stat_user_indexes
WHERE
  schemaname = 'public'
ORDER BY
  idx_scan DESC;
*/

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

/*
1. **Impacto en rendimiento**: 
   - Los índices mejoran la velocidad de lectura
   - Pero ralentizan inserts/updates
   - Solo crear índices para queries frecuentes

2. **Mantenimiento**: 
   - PostgreSQL mantiene índices automáticamente
   - ANALYZE actualiza estadísticas
   - VACUUM libera espacio

3. **Monitoreo**: 
   - Usar pg_stat_user_indexes para ver uso
   - Eliminar índices no usados
   - Ajustar según carga real

4. **En Supabase**: 
   - Todos estos índices son compatibles
   - Se pueden crear desde SQL Editor
   - No requieren configuración especial
*/

-- =====================================================
-- FIN DE ÍNDICES
-- =====================================================

COMMIT;
