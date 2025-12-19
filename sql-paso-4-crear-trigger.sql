-- =====================================================
-- PASO 4: Crear trigger para nuevos proyectos
-- =====================================================
-- Ejecuta esto después del Paso 3

-- Función del trigger
CREATE OR REPLACE FUNCTION set_project_code() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.codigo_proyecto IS NULL THEN
    NEW.codigo_proyecto := generate_project_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eliminar trigger si existe
DROP TRIGGER IF EXISTS trigger_set_project_code ON projects;

-- Crear trigger
CREATE TRIGGER trigger_set_project_code
  BEFORE INSERT ON projects
  FOR EACH ROW
  EXECUTE FUNCTION set_project_code();

-- Verificar que se creó
SELECT tgname FROM pg_trigger WHERE tgname = 'trigger_set_project_code';
