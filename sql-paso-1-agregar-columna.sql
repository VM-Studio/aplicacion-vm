-- =====================================================
-- PASO 1: Agregar columna codigo_proyecto
-- =====================================================
-- Ejecuta esto primero para agregar la columna

ALTER TABLE projects ADD COLUMN IF NOT EXISTS codigo_proyecto TEXT;

-- Verificar que se creó
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' AND column_name = 'codigo_proyecto';
