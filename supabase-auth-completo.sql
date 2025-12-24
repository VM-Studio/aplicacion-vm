-- =====================================================
-- SUPABASE AUTH COMPLETO CON ROW LEVEL SECURITY (RLS)
-- =====================================================
-- EJECUTAR EN: Supabase SQL Editor
-- Tiempo estimado: 2-3 minutos
-- =====================================================

-- =====================================================
-- PASO 1: CONECTAR TABLA USERS CON AUTH.USERS
-- =====================================================

-- Agregar columna auth_id a la tabla users (si no existe)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'auth_id'
  ) THEN
    ALTER TABLE users ADD COLUMN auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    CREATE UNIQUE INDEX IF NOT EXISTS users_auth_id_idx ON users(auth_id);
  END IF;
END $$;

-- =====================================================
-- PASO 2: TRIGGER PARA AUTO-CREAR USER EN PUBLIC.USERS
-- =====================================================

-- Función que se ejecuta cuando se registra un usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    auth_id,
    username,
    email,
    nombre_completo,
    rol,
    created_at
  ) VALUES (
    gen_random_uuid(),
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', ''),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'cliente')::text,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se ejecuta al registrar usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PASO 3: HABILITAR ROW LEVEL SECURITY EN TODAS LAS TABLAS
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 4: POLÍTICAS RLS PARA TABLA USERS
-- =====================================================

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Service role can do everything" ON users;

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = auth_id);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = auth_id);

-- Los admins pueden ver todos los usuarios
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND rol = 'admin'
    )
  );

-- Los admins pueden actualizar todos los usuarios
CREATE POLICY "Admins can update all users"
  ON users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND rol = 'admin'
    )
  );

-- Service role puede hacer todo (para backend)
CREATE POLICY "Service role can do everything"
  ON users FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- PASO 5: POLÍTICAS RLS PARA TABLA CLIENTS
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all clients" ON clients;
DROP POLICY IF EXISTS "Admins can insert clients" ON clients;
DROP POLICY IF EXISTS "Admins can update clients" ON clients;
DROP POLICY IF EXISTS "Admins can delete clients" ON clients;
DROP POLICY IF EXISTS "Clients can view own data" ON clients;

-- Los admins pueden hacer todo con clients
CREATE POLICY "Admins can view all clients"
  ON clients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Admins can insert clients"
  ON clients FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Admins can update clients"
  ON clients FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Admins can delete clients"
  ON clients FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND rol = 'admin'
    )
  );

-- Los clientes pueden ver solo sus propios datos
CREATE POLICY "Clients can view own data"
  ON clients FOR SELECT
  USING (
    id IN (
      SELECT cliente_id FROM users
      WHERE auth_id = auth.uid() AND rol = 'cliente'
    )
  );

-- =====================================================
-- PASO 6: POLÍTICAS RLS PARA TABLA PROJECTS
-- =====================================================

DROP POLICY IF EXISTS "Admins can view all projects" ON projects;
DROP POLICY IF EXISTS "Admins can insert projects" ON projects;
DROP POLICY IF EXISTS "Admins can update projects" ON projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON projects;
DROP POLICY IF EXISTS "Clients can view own projects" ON projects;

-- Los admins pueden hacer todo con projects
CREATE POLICY "Admins can view all projects"
  ON projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Admins can insert projects"
  ON projects FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Admins can update projects"
  ON projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND rol = 'admin'
    )
  );

CREATE POLICY "Admins can delete projects"
  ON projects FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND rol = 'admin'
    )
  );

-- Los clientes pueden ver solo sus proyectos
CREATE POLICY "Clients can view own projects"
  ON projects FOR SELECT
  USING (
    cliente_id IN (
      SELECT cliente_id FROM users
      WHERE auth_id = auth.uid() AND rol = 'cliente'
    )
  );

-- =====================================================
-- PASO 7: POLÍTICAS RLS PARA TABLA MESSAGES
-- =====================================================

DROP POLICY IF EXISTS "Admins can do everything with messages" ON messages;
DROP POLICY IF EXISTS "Clients can view own project messages" ON messages;
DROP POLICY IF EXISTS "Clients can send messages to own projects" ON messages;
DROP POLICY IF EXISTS "Clients can update own messages" ON messages;

-- Los admins pueden hacer todo
CREATE POLICY "Admins can do everything with messages"
  ON messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND rol = 'admin'
    )
  );

-- Los clientes pueden ver mensajes de sus proyectos
CREATE POLICY "Clients can view own project messages"
  ON messages FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN users u ON p.cliente_id = u.cliente_id
      WHERE u.auth_id = auth.uid() AND u.rol = 'cliente'
    )
  );

-- Los clientes pueden enviar mensajes a sus proyectos
CREATE POLICY "Clients can send messages to own projects"
  ON messages FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN users u ON p.cliente_id = u.cliente_id
      WHERE u.auth_id = auth.uid() AND u.rol = 'cliente'
    )
  );

-- Los clientes pueden actualizar sus propios mensajes (marcar como leído)
CREATE POLICY "Clients can update own messages"
  ON messages FOR UPDATE
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN users u ON p.cliente_id = u.cliente_id
      WHERE u.auth_id = auth.uid() AND u.rol = 'cliente'
    )
  );

-- =====================================================
-- PASO 8: POLÍTICAS RLS PARA TABLA PAYMENTS
-- =====================================================

DROP POLICY IF EXISTS "Admins can do everything with payments" ON payments;
DROP POLICY IF EXISTS "Clients can view own project payments" ON payments;

-- Los admins pueden hacer todo
CREATE POLICY "Admins can do everything with payments"
  ON payments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE auth_id = auth.uid() AND rol = 'admin'
    )
  );

-- Los clientes pueden ver pagos de sus proyectos
CREATE POLICY "Clients can view own project payments"
  ON payments FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      INNER JOIN users u ON p.cliente_id = u.cliente_id
      WHERE u.auth_id = auth.uid() AND u.rol = 'cliente'
    )
  );

-- =====================================================
-- PASO 9: CREAR FUNCIÓN HELPER PARA OBTENER USUARIO ACTUAL
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_current_user()
RETURNS TABLE (
  id UUID,
  username TEXT,
  email TEXT,
  nombre_completo TEXT,
  rol TEXT,
  cliente_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.username,
    u.email,
    u.nombre_completo,
    u.rol,
    u.cliente_id
  FROM users u
  WHERE u.auth_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PASO 10: CREAR USUARIO ADMIN INICIAL (OPCIONAL)
-- =====================================================

-- NOTA: Este usuario se debe crear desde el código usando Supabase Auth
-- No se puede crear directamente en auth.users desde SQL
-- Este es solo un ejemplo de cómo se vería:

COMMENT ON TABLE users IS 'Para crear el admin inicial, usar:
supabase.auth.signUp({
  email: "admin@vmstudio.com",
  password: "tu_password_seguro_aqui",
  options: {
    data: {
      username: "admin",
      nombre_completo: "Administrador",
      rol: "admin"
    }
  }
})';

-- =====================================================
-- PASO 11: GRANTS DE PERMISOS
-- =====================================================

-- Dar permisos necesarios para que authenticated users puedan operar
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Dar permisos para service_role (usado por el backend)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar que RLS está habilitado
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'clients', 'projects', 'messages', 'payments');

-- Ver todas las políticas creadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- ✅ COMPLETADO
-- =====================================================

SELECT 'Supabase Auth configurado correctamente!' as status,
       'RLS habilitado en todas las tablas' as rls,
       'Políticas de acceso por rol creadas' as policies,
       'Trigger para auto-crear usuarios configurado' as trigger,
       'Listo para usar supabase.auth.signUp() y signIn()' as next_step;
