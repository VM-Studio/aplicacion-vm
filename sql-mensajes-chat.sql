-- ============================================
-- SISTEMA DE MENSAJES/CHAT
-- Configuración completa para Supabase
-- ============================================

-- PASO 1: Crear la tabla de mensajes
-- ============================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  sender VARCHAR(10) NOT NULL CHECK (sender IN ('client', 'admin')),
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PASO 2: Crear índices para mejor rendimiento
-- ============================================

CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender);

-- Índice compuesto para queries frecuentes
CREATE INDEX IF NOT EXISTS idx_messages_project_sender_read 
  ON messages(project_id, sender, read);

-- PASO 3: Configurar Row Level Security (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas anteriores si existen
DROP POLICY IF EXISTS "Allow public read access to messages" ON messages;
DROP POLICY IF EXISTS "Allow public insert to messages" ON messages;
DROP POLICY IF EXISTS "Allow public update to messages" ON messages;
DROP POLICY IF EXISTS "Allow public delete to messages" ON messages;

-- Políticas: Permitir lectura pública
CREATE POLICY "Allow public read access to messages"
  ON messages
  FOR SELECT
  USING (true);

-- Políticas: Permitir inserción pública
CREATE POLICY "Allow public insert to messages"
  ON messages
  FOR INSERT
  WITH CHECK (true);

-- Políticas: Permitir actualización pública (para marcar como leído)
CREATE POLICY "Allow public update to messages"
  ON messages
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Políticas: Permitir eliminación pública (opcional)
CREATE POLICY "Allow public delete to messages"
  ON messages
  FOR DELETE
  USING (true);

-- PASO 4: Crear función para actualizar updated_at automáticamente
-- ============================================

CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- PASO 5: Crear trigger para updated_at
-- ============================================

DROP TRIGGER IF EXISTS messages_updated_at_trigger ON messages;

CREATE TRIGGER messages_updated_at_trigger
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_messages_updated_at();

-- PASO 6: Crear función para obtener mensajes no leídos por proyecto
-- ============================================

CREATE OR REPLACE FUNCTION get_unread_count(p_project_id UUID, p_sender VARCHAR)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM messages
        WHERE project_id = p_project_id
        AND sender = p_sender
        AND read = false
    );
END;
$$ LANGUAGE plpgsql;

-- PASO 7: Crear vista para estadísticas de mensajes
-- ============================================

CREATE OR REPLACE VIEW message_stats AS
SELECT 
    project_id,
    COUNT(*) as total_messages,
    COUNT(CASE WHEN sender = 'client' THEN 1 END) as client_messages,
    COUNT(CASE WHEN sender = 'admin' THEN 1 END) as admin_messages,
    COUNT(CASE WHEN read = false AND sender = 'admin' THEN 1 END) as unread_by_client,
    COUNT(CASE WHEN read = false AND sender = 'client' THEN 1 END) as unread_by_admin,
    MAX(timestamp) as last_message_time
FROM messages
GROUP BY project_id;

-- PASO 8: Crear función para marcar mensajes como leídos
-- ============================================

CREATE OR REPLACE FUNCTION mark_messages_as_read(
    p_project_id UUID,
    p_sender VARCHAR
)
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE messages
    SET read = true
    WHERE project_id = p_project_id
    AND sender = p_sender
    AND read = false;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- PASO 9: Insertar datos de prueba (OPCIONAL - comentar si no necesitas)
-- ============================================

-- Descomentar las siguientes líneas si quieres insertar mensajes de prueba
/*
INSERT INTO messages (project_id, sender, text, timestamp, read) VALUES
(
    (SELECT id FROM projects LIMIT 1),
    'admin',
    '¡Hola! Bienvenido a tu proyecto. Estamos trabajando en tu solicitud.',
    NOW() - INTERVAL '2 days',
    false
),
(
    (SELECT id FROM projects LIMIT 1),
    'client',
    'Gracias, ¿cuándo tendré una actualización?',
    NOW() - INTERVAL '1 day',
    true
),
(
    (SELECT id FROM projects LIMIT 1),
    'admin',
    'Te enviaremos una actualización mañana.',
    NOW() - INTERVAL '12 hours',
    false
);
*/

-- PASO 10: Verificación final
-- ============================================

-- Ver estructura de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'messages'
ORDER BY ordinal_position;

-- Ver índices creados
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'messages';

-- Ver políticas RLS
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'messages';

-- Ver triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'messages';

-- ============================================
-- CONSULTAS ÚTILES PARA TESTING
-- ============================================

-- Ver todos los mensajes de un proyecto específico
-- SELECT * FROM messages WHERE project_id = 'TU_PROJECT_ID' ORDER BY timestamp DESC;

-- Ver mensajes no leídos por el admin
-- SELECT * FROM messages WHERE sender = 'client' AND read = false;

-- Ver mensajes no leídos por el cliente
-- SELECT * FROM messages WHERE sender = 'admin' AND read = false;

-- Ver estadísticas de mensajes por proyecto
-- SELECT * FROM message_stats;

-- Contar mensajes no leídos de un proyecto
-- SELECT get_unread_count('TU_PROJECT_ID', 'admin');

-- Marcar mensajes como leídos
-- SELECT mark_messages_as_read('TU_PROJECT_ID', 'admin');

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

/*
1. Esta configuración permite:
   - Cliente envía mensajes (sender = 'client')
   - Admin envía mensajes (sender = 'admin')
   - Marcar mensajes como leídos
   - Contar mensajes no leídos
   - Ver estadísticas de chat

2. Los mensajes se ordenan por timestamp DESC (más recientes primero)

3. El campo 'read' indica si el mensaje fue leído:
   - Cliente marca como leídos los mensajes del admin
   - Admin marca como leídos los mensajes del cliente

4. Índices optimizados para queries frecuentes:
   - Buscar por proyecto
   - Filtrar por leído/no leído
   - Ordenar por fecha

5. RLS configurado para acceso público (ajustar según necesidad)
*/

-- ============================================
-- FIN DE LA CONFIGURACIÓN
-- ============================================

-- Para verificar que todo funciona correctamente:
SELECT 'Sistema de mensajes configurado exitosamente!' as status;
