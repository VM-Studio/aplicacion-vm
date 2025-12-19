# 📋 GUÍA PASO A PASO: Configuración Completa de Base de Datos

## 🎯 Resumen de las 5 Secciones del Panel de Cliente

1. **Mi Proyecto** - Información general, progreso, preview de Vercel
2. **Checklist** - Tareas del proyecto
3. **Chat/Notificaciones** - Mensajes entre admin y cliente
4. **Pagos** - Pagos del proyecto
5. **Modificaciones** - Solicitudes de cambios del cliente

---

## 🚀 PASO 1: Tabla PROJECTS (Principal)

**¿Qué hace?** Almacena toda la información de los proyectos.

**Ejecutar en Supabase SQL Editor:**

```sql
-- Agregar columnas faltantes
ALTER TABLE projects ADD COLUMN IF NOT EXISTS url_proyecto TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS cliente_id UUID;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS codigo VARCHAR(10) UNIQUE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS checklists JSONB DEFAULT '[]'::jsonb;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS avance INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS estado VARCHAR(50) DEFAULT 'En Progreso';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS prioridad VARCHAR(20) DEFAULT 'Media';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_projects_codigo ON projects(codigo);
CREATE INDEX IF NOT EXISTS idx_projects_cliente_id ON projects(cliente_id);
```

**✅ Verificar:** Ir a Table Editor → projects y confirmar que todas las columnas existen.

---

## 🚀 PASO 2: Tabla MESSAGES (Chat/Notificaciones)

**¿Qué hace?** Almacena mensajes entre admin y cliente.

**Ejecutar:**

```sql
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sender VARCHAR(10) NOT NULL CHECK (sender IN ('client', 'admin')),
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
```

**✅ Verificar:** Ir a Table Editor y confirmar que existe la tabla `messages`.

---

## 🚀 PASO 3: Tabla PAYMENTS (Pagos)

**¿Qué hace?** Almacena información de pagos del proyecto.

**Ejecutar:**

```sql
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  monto DECIMAL(10, 2) NOT NULL,
  fecha_pago DATE NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL,
  estado VARCHAR(20) NOT NULL CHECK (estado IN ('Pagado', 'Pendiente', 'Vencido')),
  descripcion TEXT,
  comprobante_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_proyecto_id ON payments(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_payments_estado ON payments(estado);
CREATE INDEX IF NOT EXISTS idx_payments_fecha_pago ON payments(fecha_pago);
```

**✅ Verificar:** Ir a Table Editor y confirmar que existe la tabla `payments`.

---

## 🚀 PASO 4: Tabla MODIFICACIONES (Solicitudes de Cambios)

**¿Qué hace?** Almacena solicitudes de modificaciones del cliente.

**Ejecutar:**

```sql
CREATE TABLE IF NOT EXISTS modificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT NOW(),
  estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En proceso', 'Completada', 'Rechazada')),
  respuesta_admin TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_modificaciones_proyecto_id ON modificaciones(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_modificaciones_estado ON modificaciones(estado);
CREATE INDEX IF NOT EXISTS idx_modificaciones_fecha ON modificaciones(fecha DESC);
```

**✅ Verificar:** Ir a Table Editor y confirmar que existe la tabla `modificaciones`.

---

## 🚀 PASO 5: Tabla CLIENTS (Clientes)

**¿Qué hace?** Almacena información de los clientes.

**Ejecutar:**

```sql
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  rubro VARCHAR(100),
  telefono VARCHAR(50),
  email VARCHAR(255) UNIQUE NOT NULL,
  direccion TEXT,
  notas TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_nombre ON clients(nombre);
```

**✅ Verificar:** Ir a Table Editor y confirmar que existe la tabla `clients`.

---

## 🚀 PASO 6: Tabla MEETINGS (Reuniones)

**¿Qué hace?** Almacena reuniones programadas.

**Ejecutar:**

```sql
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  duracion INTEGER DEFAULT 60,
  plataforma VARCHAR(50) DEFAULT 'Google Meet',
  link_reunion TEXT,
  notas TEXT,
  estado VARCHAR(20) DEFAULT 'Programada' CHECK (estado IN ('Programada', 'Completada', 'Cancelada')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meetings_proyecto_id ON meetings(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_meetings_fecha ON meetings(fecha);
CREATE INDEX IF NOT EXISTS idx_meetings_estado ON meetings(estado);
```

**✅ Verificar:** Ir a Table Editor y confirmar que existe la tabla `meetings`.

---

## 🚀 PASO 7: Row Level Security (RLS)

**¿Qué hace?** Habilita seguridad y políticas de acceso.

**Ejecutar:**

```sql
-- Habilitar RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE modificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Políticas para projects
DROP POLICY IF EXISTS "Allow public read access to projects" ON projects;
CREATE POLICY "Allow public read access to projects" ON projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to projects" ON projects;
CREATE POLICY "Allow public insert to projects" ON projects FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to projects" ON projects;
CREATE POLICY "Allow public update to projects" ON projects FOR UPDATE USING (true);

-- Políticas para messages
DROP POLICY IF EXISTS "Allow public read access to messages" ON messages;
CREATE POLICY "Allow public read access to messages" ON messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to messages" ON messages;
CREATE POLICY "Allow public insert to messages" ON messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to messages" ON messages;
CREATE POLICY "Allow public update to messages" ON messages FOR UPDATE USING (true);

-- Políticas para payments
DROP POLICY IF EXISTS "Allow public read access to payments" ON payments;
CREATE POLICY "Allow public read access to payments" ON payments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to payments" ON payments;
CREATE POLICY "Allow public insert to payments" ON payments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to payments" ON payments;
CREATE POLICY "Allow public update to payments" ON payments FOR UPDATE USING (true);

-- Políticas para modificaciones
DROP POLICY IF EXISTS "Allow public read access to modificaciones" ON modificaciones;
CREATE POLICY "Allow public read access to modificaciones" ON modificaciones FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to modificaciones" ON modificaciones;
CREATE POLICY "Allow public insert to modificaciones" ON modificaciones FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to modificaciones" ON modificaciones;
CREATE POLICY "Allow public update to modificaciones" ON modificaciones FOR UPDATE USING (true);

-- Políticas para clients
DROP POLICY IF EXISTS "Allow public read access to clients" ON clients;
CREATE POLICY "Allow public read access to clients" ON clients FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to clients" ON clients;
CREATE POLICY "Allow public insert to clients" ON clients FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to clients" ON clients;
CREATE POLICY "Allow public update to clients" ON clients FOR UPDATE USING (true);

-- Políticas para meetings
DROP POLICY IF EXISTS "Allow public read access to meetings" ON meetings;
CREATE POLICY "Allow public read access to meetings" ON meetings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert to meetings" ON meetings;
CREATE POLICY "Allow public insert to meetings" ON meetings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update to meetings" ON meetings;
CREATE POLICY "Allow public update to meetings" ON meetings FOR UPDATE USING (true);
```

**✅ Verificar:** Ir a Authentication → Policies y confirmar que todas las políticas están creadas.

---

## 🚀 PASO 8: Triggers de Updated_at

**¿Qué hace?** Actualiza automáticamente la fecha de modificación.

**Ejecutar:**

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_modificaciones_updated_at ON modificaciones;
CREATE TRIGGER update_modificaciones_updated_at BEFORE UPDATE ON modificaciones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_meetings_updated_at ON meetings;
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**✅ Verificar:** Los triggers se ejecutarán automáticamente al actualizar registros.

---

## ✅ VERIFICACIÓN FINAL

**Ver todas las tablas:**

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Debería mostrar:**
- clients
- meetings
- messages
- modificaciones
- payments
- projects

---

## 🎉 ¡LISTO!

Tu base de datos está completa y lista para funcionar con todas las secciones del panel de cliente:

✅ **Mi Proyecto** → tabla `projects`
✅ **Checklist** → columna `checklists` en `projects` (JSONB)
✅ **Chat** → tabla `messages`
✅ **Pagos** → tabla `payments`
✅ **Modificaciones** → tabla `modificaciones`

---

## 📝 NOTAS IMPORTANTES

1. **Ejecuta los pasos en orden** (1 al 8)
2. **Verifica cada paso** antes de continuar
3. Si hay errores, léelos cuidadosamente - pueden indicar que algo ya existe (lo cual está bien)
4. Los comandos usan `IF NOT EXISTS` para evitar errores si ya existen

¿Algún error? Copia el mensaje completo y te ayudo a resolverlo.
