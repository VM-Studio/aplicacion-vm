-- =====================================================
-- SCRIPT PARA GENERAR CÓDIGOS EN PROYECTOS EXISTENTES
-- =====================================================
-- Ejecuta este script en Supabase SQL Editor
-- para actualizar proyectos que no tienen código

-- Generar códigos para proyectos existentes que no tienen
UPDATE projects 
SET codigo_proyecto = generate_project_code() 
WHERE codigo_proyecto IS NULL OR codigo_proyecto = '' OR LENGTH(codigo_proyecto) < 8;

-- Verificar cuántos proyectos tienen código
SELECT 
  COUNT(*) as total_proyectos,
  COUNT(codigo_proyecto) as con_codigo,
  COUNT(*) - COUNT(codigo_proyecto) as sin_codigo
FROM projects;

-- Ver todos los proyectos con sus códigos
SELECT 
  id,
  nombre,
  codigo_proyecto,
  codigo as codigo_legacy,
  created_at
FROM projects
ORDER BY created_at DESC;
