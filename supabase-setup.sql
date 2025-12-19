-- =====================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS PARA VM STUDIO
-- Ejecuta este script en el SQL Editor de Supabase
-- =====================================================

-- =====================================================
-- 1. TABLA DE CLIENTES
-- =====================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  rubro TEXT NOT NULL,
  telefono TEXT,
  email TEXT,
  direccion TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- 2. TABLA DE PROYECTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  cliente_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  codigo TEXT UNIQUE NOT NULL,
  checklists JSONB DEFAULT '[]'::jsonb,
  fecha_estimada DATE,
  fecha_inicio DATE DEFAULT CURRENT_DATE,
  avance INTEGER DEFAULT 0 CHECK (avance >= 0 AND avance <= 100),
  estado TEXT DEFAULT 'en_progreso' CHECK (estado IN ('pendiente', 'en_progreso', 'completado', 'cancelado')),
  prioridad TEXT DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- 3. TABLA DE NOTIFICACIONES
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  tipo TEXT DEFAULT 'info' CHECK (tipo IN ('info', 'success', 'warning', 'error')),
  destinatario TEXT NOT NULL CHECK (destinatario IN ('admin', 'cliente')),
  cliente_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  proyecto_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  leido BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- 4. TABLA DE PAGOS
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proyecto_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  monto DECIMAL(10, 2) NOT NULL CHECK (monto > 0),
  fecha_pago DATE NOT NULL,
  metodo_pago TEXT NOT NULL,
  estado TEXT DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Pagado', 'Vencido')),
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- 5. TABLA DE MEETINGS (REUNIONES)
-- =====================================================
CREATE TABLE IF NOT EXISTS meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  proyecto_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  fecha_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  duracion_minutos INTEGER DEFAULT 60,
  ubicacion TEXT,
  link_reunion TEXT,
  tipo TEXT DEFAULT 'presencial' CHECK (tipo IN ('presencial', 'virtual', 'hibrida')),
  estado TEXT DEFAULT 'programada' CHECK (estado IN ('programada', 'completada', 'cancelada', 'reprogramada')),
  participantes JSONB DEFAULT '[]'::jsonb,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- 6. TABLA DE PRESUPUESTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_presupuesto TEXT UNIQUE NOT NULL,
  cliente_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  proyecto_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  items JSONB DEFAULT '[]'::jsonb, -- Array de {concepto, cantidad, precio_unitario, subtotal}
  subtotal DECIMAL(10, 2) DEFAULT 0,
  descuento DECIMAL(10, 2) DEFAULT 0,
  impuestos DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  moneda TEXT DEFAULT 'ARS' CHECK (moneda IN ('ARS', 'USD', 'EUR')),
  estado TEXT DEFAULT 'borrador' CHECK (estado IN ('borrador', 'enviado', 'aprobado', 'rechazado', 'vencido')),
  validez_dias INTEGER DEFAULT 30,
  fecha_emision DATE DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE,
  fecha_aprobacion DATE,
  notas TEXT,
  terminos_condiciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- 7. TABLA DE ARCHIVOS/DOCUMENTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  tipo_archivo TEXT NOT NULL,
  tamaño_bytes BIGINT,
  url TEXT NOT NULL,
  proyecto_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  categoria TEXT CHECK (categoria IN ('contrato', 'comprobante', 'diseño', 'documento', 'imagen', 'video', 'otro')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- 8. TABLA DE USUARIOS (ADMIN Y CLIENTES)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE,
  nombre_completo TEXT,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'cliente')),
  cliente_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  activo BOOLEAN DEFAULT true,
  ultimo_acceso TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- 9. TABLA DE ACTIVIDAD/LOGS
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES users(id) ON DELETE SET NULL,
  accion TEXT NOT NULL,
  tabla_afectada TEXT,
  registro_id UUID,
  detalles JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (BÁSICAS - AJUSTAR EN PRODUCCIÓN)
-- =====================================================

-- Políticas para CLIENTS
CREATE POLICY "Enable read access for all users" ON clients FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON clients FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON clients FOR DELETE USING (true);

-- Políticas para PROJECTS
CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON projects FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON projects FOR DELETE USING (true);

-- Políticas para NOTIFICATIONS
CREATE POLICY "Enable read access for all users" ON notifications FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON notifications FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON notifications FOR DELETE USING (true);

-- Políticas para PAYMENTS
CREATE POLICY "Enable read access for all users" ON payments FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON payments FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON payments FOR DELETE USING (true);

-- Políticas para MEETINGS
CREATE POLICY "Enable read access for all users" ON meetings FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON meetings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON meetings FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON meetings FOR DELETE USING (true);

-- Políticas para BUDGETS
CREATE POLICY "Enable read access for all users" ON budgets FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON budgets FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON budgets FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON budgets FOR DELETE USING (true);

-- Políticas para DOCUMENTS
CREATE POLICY "Enable read access for all users" ON documents FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON documents FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON documents FOR DELETE USING (true);

-- Políticas para USERS
CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON users FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON users FOR DELETE USING (true);

-- Políticas para ACTIVITY_LOGS
CREATE POLICY "Enable read access for all users" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON activity_logs FOR INSERT WITH CHECK (true);

-- =====================================================
-- ÍNDICES PARA MEJORAR EL RENDIMIENTO
-- =====================================================

-- Índices para CLIENTS
CREATE INDEX IF NOT EXISTS idx_clients_nombre ON clients(nombre);
CREATE INDEX IF NOT EXISTS idx_clients_rubro ON clients(rubro);

-- Índices para PROJECTS
CREATE INDEX IF NOT EXISTS idx_projects_cliente_id ON projects(cliente_id);
CREATE INDEX IF NOT EXISTS idx_projects_codigo ON projects(codigo);
CREATE INDEX IF NOT EXISTS idx_projects_estado ON projects(estado);
CREATE INDEX IF NOT EXISTS idx_projects_fecha_estimada ON projects(fecha_estimada);

-- Índices para NOTIFICATIONS
CREATE INDEX IF NOT EXISTS idx_notifications_destinatario ON notifications(destinatario);
CREATE INDEX IF NOT EXISTS idx_notifications_leido ON notifications(leido);
CREATE INDEX IF NOT EXISTS idx_notifications_cliente_id ON notifications(cliente_id);
CREATE INDEX IF NOT EXISTS idx_notifications_proyecto_id ON notifications(proyecto_id);

-- Índices para PAYMENTS
CREATE INDEX IF NOT EXISTS idx_payments_proyecto_id ON payments(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_payments_estado ON payments(estado);
CREATE INDEX IF NOT EXISTS idx_payments_fecha_pago ON payments(fecha_pago);

-- Índices para MEETINGS
CREATE INDEX IF NOT EXISTS idx_meetings_proyecto_id ON meetings(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_meetings_cliente_id ON meetings(cliente_id);
CREATE INDEX IF NOT EXISTS idx_meetings_fecha_hora ON meetings(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_meetings_estado ON meetings(estado);

-- Índices para BUDGETS
CREATE INDEX IF NOT EXISTS idx_budgets_cliente_id ON budgets(cliente_id);
CREATE INDEX IF NOT EXISTS idx_budgets_proyecto_id ON budgets(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_budgets_numero ON budgets(numero_presupuesto);
CREATE INDEX IF NOT EXISTS idx_budgets_estado ON budgets(estado);

-- Índices para DOCUMENTS
CREATE INDEX IF NOT EXISTS idx_documents_proyecto_id ON documents(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_documents_cliente_id ON documents(cliente_id);
CREATE INDEX IF NOT EXISTS idx_documents_categoria ON documents(categoria);

-- Índices para USERS
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_rol ON users(rol);
CREATE INDEX IF NOT EXISTS idx_users_cliente_id ON users(cliente_id);

-- Índices para ACTIVITY_LOGS
CREATE INDEX IF NOT EXISTS idx_activity_logs_usuario_id ON activity_logs(usuario_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_tabla_afectada ON activity_logs(tabla_afectada);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- =====================================================
-- FUNCIONES Y TRIGGERS PARA UPDATED_AT AUTOMÁTICO
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS DE PRUEBA (OPCIONAL - COMENTAR EN PRODUCCIÓN)
-- =====================================================

-- Insertar usuario admin de prueba (password: "123" - cambiar en producción)
INSERT INTO users (username, password_hash, email, nombre_completo, rol, activo)
VALUES 
  ('admin123', '123', 'admin@vmstudio.com', 'Administrador VM Studio', 'admin', true),
  ('cliente123', '123', 'cliente@ejemplo.com', 'Cliente de Prueba', 'cliente', true)
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista para proyectos con información del cliente
CREATE OR REPLACE VIEW v_projects_with_client AS
SELECT 
  p.*,
  c.nombre as cliente_nombre,
  c.rubro as cliente_rubro,
  c.telefono as cliente_telefono,
  c.email as cliente_email
FROM projects p
LEFT JOIN clients c ON p.cliente_id = c.id;

-- Vista para pagos con información del proyecto y cliente
CREATE OR REPLACE VIEW v_payments_with_details AS
SELECT 
  pay.*,
  p.nombre as proyecto_nombre,
  p.codigo as proyecto_codigo,
  c.nombre as cliente_nombre,
  c.rubro as cliente_rubro
FROM payments pay
LEFT JOIN projects p ON pay.proyecto_id = p.id
LEFT JOIN clients c ON p.cliente_id = c.id;

-- Vista para notificaciones no leídas
CREATE OR REPLACE VIEW v_unread_notifications AS
SELECT 
  n.*,
  c.nombre as cliente_nombre,
  p.nombre as proyecto_nombre
FROM notifications n
LEFT JOIN clients c ON n.cliente_id = c.id
LEFT JOIN projects p ON n.proyecto_id = p.id
WHERE n.leido = false
ORDER BY n.created_at DESC;

-- =====================================================
-- =====================================================
-- TABLA DE MODIFICACIONES (Cliente Panel)
-- =====================================================

CREATE TABLE IF NOT EXISTS modificaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proyecto_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  texto TEXT NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  estado TEXT DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En proceso', 'Completada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- RLS para modificaciones
ALTER TABLE modificaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON modificaciones FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON modificaciones FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON modificaciones FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON modificaciones FOR DELETE USING (true);

-- Índices para modificaciones
CREATE INDEX IF NOT EXISTS idx_modificaciones_proyecto_id ON modificaciones(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_modificaciones_estado ON modificaciones(estado);

-- Trigger para modificaciones
CREATE TRIGGER update_modificaciones_updated_at 
  BEFORE UPDATE ON modificaciones
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- AGREGAR CAMPOS ADICIONALES A PROJECTS
-- =====================================================

ALTER TABLE projects ADD COLUMN IF NOT EXISTS url_proyecto TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS codigo_proyecto TEXT;

-- Agregar constraint UNIQUE si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'projects_codigo_proyecto_key'
  ) THEN
    ALTER TABLE projects ADD CONSTRAINT projects_codigo_proyecto_key UNIQUE (codigo_proyecto);
  END IF;
END $$;

-- Crear función para generar código único de 8 caracteres
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

-- Trigger para generar código automáticamente al crear proyecto
CREATE OR REPLACE FUNCTION set_project_code() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.codigo_proyecto IS NULL THEN
    NEW.codigo_proyecto := generate_project_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_project_code ON projects;
CREATE TRIGGER trigger_set_project_code
  BEFORE INSERT ON projects
  FOR EACH ROW
  EXECUTE FUNCTION set_project_code();

-- Agregar índice para búsqueda rápida por código
CREATE INDEX IF NOT EXISTS idx_projects_codigo ON projects(codigo_proyecto);

-- =====================================================
-- GENERAR CÓDIGOS PARA PROYECTOS EXISTENTES
-- =====================================================

-- Actualizar proyectos que no tienen código
UPDATE projects 
SET codigo_proyecto = generate_project_code() 
WHERE codigo_proyecto IS NULL OR codigo_proyecto = '';

-- COMENTARIOS INFORMATIVOS
-- =====================================================

COMMENT ON TABLE clients IS 'Tabla de clientes del sistema';
COMMENT ON TABLE projects IS 'Tabla de proyectos asociados a clientes';
COMMENT ON TABLE notifications IS 'Notificaciones del sistema para admins y clientes';
COMMENT ON TABLE payments IS 'Registro de pagos y facturación';
COMMENT ON TABLE meetings IS 'Reuniones programadas con clientes';
COMMENT ON TABLE budgets IS 'Presupuestos y cotizaciones';
COMMENT ON TABLE documents IS 'Archivos y documentos asociados a proyectos';
COMMENT ON TABLE users IS 'Usuarios del sistema (admins y clientes)';
COMMENT ON TABLE activity_logs IS 'Log de actividades del sistema';
COMMENT ON TABLE modificaciones IS 'Solicitudes de modificación de los clientes';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
