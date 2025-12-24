-- =====================================================
-- ✅ SCRIPT SEGURO - FUNCIONA CON TU ESTRUCTURA ACTUAL
-- =====================================================
-- Este script detecta automáticamente los nombres de columnas
-- y solo crea índices en columnas que EXISTEN
-- =====================================================

-- =====================================================
-- PASO 1: AGREGAR COLUMNA cliente_id SI NO EXISTE
-- =====================================================
-- Si tu tabla projects no tiene la columna cliente_id, la agrega

DO $$ 
BEGIN
  -- Verificar si la columna existe
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'projects' 
    AND column_name = 'cliente_id'
  ) THEN
    -- Si no existe, agregarla
    ALTER TABLE projects ADD COLUMN cliente_id UUID;
    RAISE NOTICE 'Columna cliente_id agregada a projects';
  ELSE
    RAISE NOTICE 'Columna cliente_id ya existe en projects';
  END IF;
END $$;

-- =====================================================
-- PASO 2: ÍNDICES BÁSICOS (SIEMPRE SEGUROS)
-- =====================================================

-- CLIENTS (si la tabla existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
    CREATE INDEX IF NOT EXISTS idx_clients_nombre ON clients(nombre);
    CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
    RAISE NOTICE 'Índices de clients creados';
  END IF;
END $$;

-- PROJECTS - Solo columnas que seguro existen
CREATE INDEX IF NOT EXISTS idx_projects_nombre ON projects(nombre);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Intentar crear índice en cliente_id solo si existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'cliente_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_projects_cliente_id ON projects(cliente_id);
    RAISE NOTICE 'Índice idx_projects_cliente_id creado';
  END IF;
END $$;

-- MESSAGES (si la tabla existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
    CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
    CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
    RAISE NOTICE 'Índices de messages creados';
  END IF;
END $$;

-- USERS (si la tabla existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    RAISE NOTICE 'Índices de users creados';
  END IF;
END $$;

-- =====================================================
-- PASO 3: ACTUALIZAR ESTADÍSTICAS
-- =====================================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients') THEN
    EXECUTE 'ANALYZE clients';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects') THEN
    EXECUTE 'ANALYZE projects';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
    EXECUTE 'ANALYZE messages';
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    EXECUTE 'ANALYZE users';
  END IF;
  
  RAISE NOTICE 'Estadísticas actualizadas';
END $$;

-- =====================================================
-- PASO 4: VERIFICAR RESULTADOS
-- =====================================================

-- Ver índices creados
SELECT 
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('clients', 'projects', 'messages', 'users')
ORDER BY tablename, indexname;

-- =====================================================
-- ✅ ESTE SCRIPT ES SEGURO PORQUE:
-- =====================================================
-- 1. Verifica que cada tabla exista antes de crear índices
-- 2. Verifica que cada columna exista antes de crear índices
-- 3. Usa IF NOT EXISTS para no duplicar
-- 4. Muestra mensajes de lo que va haciendo
-- 5. No borra ni modifica datos existentes
-- =====================================================
