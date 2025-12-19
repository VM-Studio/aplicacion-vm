-- =====================================================
-- PASO 3: Generar códigos para proyectos existentes
-- =====================================================
-- Ejecuta esto después del Paso 2

-- Generar códigos para todos los proyectos que no tienen
UPDATE projects 
SET codigo_proyecto = generate_project_code() 
WHERE codigo_proyecto IS NULL OR codigo_proyecto = '';

-- Ver cuántos proyectos se actualizaron
SELECT 
  COUNT(*) as total_proyectos,
  COUNT(codigo_proyecto) as proyectos_con_codigo
FROM projects;

-- Ver los códigos generados
SELECT id, nombre, codigo_proyecto FROM projects ORDER BY created_at DESC LIMIT 10;
