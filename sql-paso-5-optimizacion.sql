-- =====================================================
-- PASO 5 (OPCIONAL): Agregar constraint UNIQUE y índice
-- =====================================================
-- Ejecuta esto al final para optimización

-- Agregar constraint UNIQUE
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'projects_codigo_proyecto_key'
  ) THEN
    ALTER TABLE projects ADD CONSTRAINT projects_codigo_proyecto_key UNIQUE (codigo_proyecto);
  END IF;
END $$;

-- Crear índice para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_projects_codigo ON projects(codigo_proyecto);

-- Verificar constraints e índices
SELECT 
  conname as constraint_name,
  contype as constraint_type
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass AND conname LIKE '%codigo%';

SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'projects' AND indexname LIKE '%codigo%';
