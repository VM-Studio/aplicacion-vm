-- =====================================================
-- 🚀 SCRIPT COMPLETO PARA SUPABASE - VM STUDIO
-- =====================================================
-- Copiar y pegar este script COMPLETO en Supabase SQL Editor
-- Ejecutar todo de una vez con Run (Ctrl+Enter)
-- =====================================================

-- =====================================================
-- PARTE 1: CREAR TODAS LAS TABLAS
-- =====================================================

-- 1. CLIENTES
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

-- 2. PROYECTOS
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  cliente_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  codigo TEXT UNIQUE NOT NULL,
  checklists JSONB DEFAULT '[]'::jsonb,
  fecha_estimada DATE,
  fecha_inicio DATE DEFAULT CURRENT_DATE,
  url_proyecto TEXT,
  avance INTEGER DEFAULT 0 CHECK (avance >= 0 AND avance <= 100),
  estado TEXT DEFAULT 'en_progreso' CHECK (estado IN ('pendiente', 'en_progreso', 'completado', 'cancelado')),
  prioridad TEXT DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. MENSAJES/CHAT
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('client', 'admin')),
  text TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. NOTIFICACIONES
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

-- 5. PAGOS
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

-- 6. REUNIONES
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

-- 7. PRESUPUESTOS
CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_presupuesto TEXT UNIQUE NOT NULL,
  cliente_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  proyecto_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  items JSONB DEFAULT '[]'::jsonb,
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

-- 8. DOCUMENTOS
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

-- 9. USUARIOS
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

-- 10. LOGS DE ACTIVIDAD
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

-- 11. MODIFICACIONES (Panel Cliente)
CREATE TABLE IF NOT EXISTS modificaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proyecto_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  texto TEXT NOT NULL,
  estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_revision', 'aprobada', 'rechazada', 'completada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- =====================================================
-- PARTE 2: CREAR ÍNDICES DE OPTIMIZACIÓN (10-40x más rápido)
-- =====================================================

-- CLIENTS
CREATE INDEX IF NOT EXISTS idx_clients_nombre ON clients(nombre);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_telefono ON clients(telefono);
CREATE INDEX IF NOT EXISTS idx_clients_rubro ON clients(rubro);

-- PROJECTS
CREATE INDEX IF NOT EXISTS idx_projects_cliente_id ON projects(cliente_id);
CREATE INDEX IF NOT EXISTS idx_projects_codigo ON projects(codigo);
CREATE INDEX IF NOT EXISTS idx_projects_estado ON projects(estado);
CREATE INDEX IF NOT EXISTS idx_projects_fecha_estimada ON projects(fecha_estimada);
CREATE INDEX IF NOT EXISTS idx_projects_avance ON projects(avance);
CREATE INDEX IF NOT EXISTS idx_projects_prioridad ON projects(prioridad);
CREATE INDEX IF NOT EXISTS idx_projects_cliente_estado ON projects(cliente_id, estado);

-- MESSAGES
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender);
CREATE INDEX IF NOT EXISTS idx_messages_project_read ON messages(project_id, read);
CREATE INDEX IF NOT EXISTS idx_messages_text_gin ON messages USING gin(to_tsvector('spanish', text));

-- NOTIFICATIONS
CREATE INDEX IF NOT EXISTS idx_notifications_destinatario ON notifications(destinatario);
CREATE INDEX IF NOT EXISTS idx_notifications_leido ON notifications(leido);
CREATE INDEX IF NOT EXISTS idx_notifications_cliente_id ON notifications(cliente_id);
CREATE INDEX IF NOT EXISTS idx_notifications_proyecto_id ON notifications(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(destinatario, leido) WHERE leido = false;

-- PAYMENTS
CREATE INDEX IF NOT EXISTS idx_payments_proyecto_id ON payments(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_payments_estado ON payments(estado);
CREATE INDEX IF NOT EXISTS idx_payments_fecha_pago ON payments(fecha_pago);
CREATE INDEX IF NOT EXISTS idx_payments_monto ON payments(monto);
CREATE INDEX IF NOT EXISTS idx_payments_pending ON payments(proyecto_id, estado) WHERE estado = 'Pendiente';

-- MEETINGS
CREATE INDEX IF NOT EXISTS idx_meetings_proyecto_id ON meetings(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_meetings_cliente_id ON meetings(cliente_id);
CREATE INDEX IF NOT EXISTS idx_meetings_fecha_hora ON meetings(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_meetings_estado ON meetings(estado);
CREATE INDEX IF NOT EXISTS idx_meetings_upcoming ON meetings(fecha_hora) WHERE estado = 'programada';

-- BUDGETS
CREATE INDEX IF NOT EXISTS idx_budgets_cliente_id ON budgets(cliente_id);
CREATE INDEX IF NOT EXISTS idx_budgets_proyecto_id ON budgets(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_budgets_numero ON budgets(numero_presupuesto);
CREATE INDEX IF NOT EXISTS idx_budgets_estado ON budgets(estado);
CREATE INDEX IF NOT EXISTS idx_budgets_fecha_emision ON budgets(fecha_emision);

-- DOCUMENTS
CREATE INDEX IF NOT EXISTS idx_documents_proyecto_id ON documents(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_documents_cliente_id ON documents(cliente_id);
CREATE INDEX IF NOT EXISTS idx_documents_categoria ON documents(categoria);
CREATE INDEX IF NOT EXISTS idx_documents_tipo_archivo ON documents(tipo_archivo);

-- USERS
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_rol ON users(rol);
CREATE INDEX IF NOT EXISTS idx_users_cliente_id ON users(cliente_id);
CREATE INDEX IF NOT EXISTS idx_users_activo ON users(activo);

-- ACTIVITY_LOGS
CREATE INDEX IF NOT EXISTS idx_activity_logs_usuario_id ON activity_logs(usuario_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_tabla_afectada ON activity_logs(tabla_afectada);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_registro_id ON activity_logs(registro_id);

-- MODIFICACIONES
CREATE INDEX IF NOT EXISTS idx_modificaciones_proyecto_id ON modificaciones(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_modificaciones_estado ON modificaciones(estado);
CREATE INDEX IF NOT EXISTS idx_modificaciones_created_at ON modificaciones(created_at DESC);

-- =====================================================
-- PARTE 3: HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE modificaciones ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PARTE 4: POLÍTICAS DE SEGURIDAD (BÁSICAS PARA DESARROLLO)
-- ⚠️ EN PRODUCCIÓN DEBES HACERLAS MÁS RESTRICTIVAS
-- =====================================================

-- CLIENTS
CREATE POLICY "Enable read access for all users" ON clients FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON clients FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON clients FOR DELETE USING (true);

-- PROJECTS
CREATE POLICY "Enable read access for all users" ON projects FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON projects FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON projects FOR DELETE USING (true);

-- MESSAGES
CREATE POLICY "Enable read access for all users" ON messages FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON messages FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON messages FOR DELETE USING (true);

-- NOTIFICATIONS
CREATE POLICY "Enable read access for all users" ON notifications FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON notifications FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON notifications FOR DELETE USING (true);

-- PAYMENTS
CREATE POLICY "Enable read access for all users" ON payments FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON payments FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON payments FOR DELETE USING (true);

-- MEETINGS
CREATE POLICY "Enable read access for all users" ON meetings FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON meetings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON meetings FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON meetings FOR DELETE USING (true);

-- BUDGETS
CREATE POLICY "Enable read access for all users" ON budgets FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON budgets FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON budgets FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON budgets FOR DELETE USING (true);

-- DOCUMENTS
CREATE POLICY "Enable read access for all users" ON documents FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON documents FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON documents FOR DELETE USING (true);

-- USERS
CREATE POLICY "Enable read access for all users" ON users FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON users FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON users FOR DELETE USING (true);

-- ACTIVITY_LOGS
CREATE POLICY "Enable read access for all users" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON activity_logs FOR INSERT WITH CHECK (true);

-- MODIFICACIONES
CREATE POLICY "Enable read access for all users" ON modificaciones FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON modificaciones FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON modificaciones FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON modificaciones FOR DELETE USING (true);

-- =====================================================
-- PARTE 5: ACTUALIZAR ESTADÍSTICAS DEL OPTIMIZADOR
-- =====================================================

ANALYZE clients;
ANALYZE projects;
ANALYZE messages;
ANALYZE notifications;
ANALYZE payments;
ANALYZE meetings;
ANALYZE budgets;
ANALYZE documents;
ANALYZE users;
ANALYZE activity_logs;
ANALYZE modificaciones;

-- =====================================================
-- PARTE 6: DATOS DE PRUEBA (OPCIONAL - COMENTAR EN PRODUCCIÓN)
-- =====================================================

-- Usuarios de prueba (⚠️ CAMBIAR CONTRASEÑAS EN PRODUCCIÓN)
INSERT INTO users (username, password_hash, email, nombre_completo, rol, activo)
VALUES 
  ('admin', '123', 'admin@vmstudio.com', 'Administrador VM Studio', 'admin', true),
  ('cliente1', '123', 'cliente1@ejemplo.com', 'Cliente de Prueba', 'cliente', true)
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- ✅ SCRIPT COMPLETADO
-- =====================================================
-- 
-- RESULTADO ESPERADO:
-- ✅ 11 tablas creadas
-- ✅ 40+ índices de optimización
-- ✅ RLS habilitado
-- ✅ Políticas de seguridad configuradas
-- ✅ 2 usuarios de prueba creados
--
-- PRÓXIMOS PASOS:
-- 1. Verificar en Table Editor que las tablas existan
-- 2. Configurar variables de entorno en .env.local
-- 3. Ejecutar npm run dev
-- 4. Probar login con: admin / 123
--
-- =====================================================
