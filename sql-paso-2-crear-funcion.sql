-- =====================================================
-- PASO 2: Crear función para generar códigos
-- =====================================================
-- Ejecuta esto después del Paso 1

-- Función que genera código de 8 caracteres
CREATE OR REPLACE FUNCTION generate_project_code() RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Verificar que se creó
SELECT proname FROM pg_proc WHERE proname = 'generate_project_code';
