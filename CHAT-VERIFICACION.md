# ✅ Verificación del Sistema de Chat

## 🔧 Cambios Realizados

### 1. **Admin Panel - NotificationsPage.tsx**
- ✅ Actualizado para usar Supabase en lugar de datos mock
- ✅ Cambio de enfoque: de clientes a proyectos
- ✅ Integración correcta con la tabla `messages`
- ✅ Función `handleSendMessage` ahora guarda mensajes en la base de datos
- ✅ Carga automática de proyectos y mensajes al abrir
- ✅ Actualización en tiempo real cuando se selecciona un proyecto

### 2. **Cliente Panel - page.tsx**
- ✅ Ya estaba correctamente configurado
- ✅ Usa la tabla `messages` con los campos correctos
- ✅ `handleSendMessage` guarda mensajes correctamente

### 3. **Estructura de la Tabla Messages**
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id),
  sender TEXT CHECK (sender IN ('client', 'admin')),
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);
```

## 📋 Pasos para Verificar que Todo Funcione

### Paso 1: Verificar que la tabla messages existe

1. Ve a https://supabase.com
2. Abre tu proyecto
3. Ve a **Table Editor** en el menú lateral
4. Busca la tabla `messages`

**Si NO existe la tabla:**
1. Ve a **SQL Editor**
2. Crea una nueva query
3. Copia y pega el siguiente código:

```sql
-- Crear tabla messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL,
  sender TEXT CHECK (sender IN ('client', 'admin')),
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);

-- Habilitar Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Política para SELECT (cualquiera puede leer)
CREATE POLICY "Enable read access for all users" ON messages
  FOR SELECT USING (true);

-- Política para INSERT (cualquiera puede insertar)
CREATE POLICY "Enable insert access for all users" ON messages
  FOR INSERT WITH CHECK (true);

-- Política para UPDATE (cualquiera puede actualizar)
CREATE POLICY "Enable update access for all users" ON messages
  FOR UPDATE USING (true);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. Haz clic en **Run** o presiona `Ctrl/Cmd + Enter`

### Paso 2: Verificar que el servidor está corriendo

Abre una terminal y ejecuta:
```bash
cd /Users/valendelatorre/aplicacion-vm
npm run dev
```

Deberías ver algo como:
```
▲ Next.js 16.1.0
- Local:        http://localhost:3000
```

### Paso 3: Probar el chat desde el Panel Admin

1. Abre http://localhost:3000/admin
2. Haz clic en **"Notificaciones"** en el menú lateral
3. Selecciona un proyecto de la lista (debe haber al menos un proyecto creado)
4. Escribe un mensaje y presiona Enter o haz clic en el botón de enviar
5. Ve a Supabase > Table Editor > messages
6. Deberías ver el mensaje guardado con:
   - `project_id`: ID del proyecto
   - `sender`: "admin"
   - `text`: tu mensaje
   - `timestamp`: fecha actual

### Paso 4: Probar el chat desde el Panel Cliente

1. Abre http://localhost:3000/cliente
2. Ingresa el código del proyecto (ej: "TH9YCA")
3. Haz clic en **"Notificaciones"** en el menú lateral
4. Escribe un mensaje y envíalo
5. Ve a Supabase > Table Editor > messages
6. Deberías ver el mensaje guardado con:
   - `project_id`: ID del proyecto
   - `sender`: "client"
   - `text`: tu mensaje
   - `timestamp`: fecha actual

### Paso 5: Verificar que los mensajes se muestran en ambos paneles

1. **En Admin**: Deberías ver todos los mensajes del proyecto seleccionado
   - Mensajes del admin: a la derecha, fondo azul
   - Mensajes del cliente: a la izquierda, fondo blanco

2. **En Cliente**: Deberías ver todos los mensajes de tu proyecto
   - Mensajes del cliente: a la derecha, fondo azul
   - Mensajes del admin: a la izquierda, fondo blanco

## 🐛 Solución de Problemas

### Problema: "Messages no aparecen"
**Solución:**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña **Network**
3. Filtra por "messages"
4. Envía un mensaje
5. Verifica que la petición a Supabase retorne status 201 (Created)

### Problema: "Error de permisos en Supabase"
**Solución:**
1. Ve a Supabase > Authentication > Policies
2. Verifica que la tabla `messages` tenga RLS habilitado
3. Verifica que haya políticas para SELECT, INSERT, UPDATE
4. Si no hay políticas, ejecuta el SQL del Paso 1

### Problema: "project_id no se encuentra"
**Solución:**
1. Verifica que el proyecto exista en la tabla `projects`
2. Verifica que el `codigo` del proyecto sea correcto
3. En el panel cliente, verifica que el código ingresado sea válido

## ✨ Funcionalidades del Chat

### Panel Admin
- ✅ Ve TODOS los proyectos en la lista
- ✅ Puede seleccionar cualquier proyecto para chatear
- ✅ Ve el nombre del proyecto y del cliente
- ✅ Contador de mensajes no leídos por proyecto
- ✅ Últimos mensajes de cada proyecto
- ✅ Envío de mensajes con Enter o botón
- ✅ Scroll automático a mensajes nuevos

### Panel Cliente
- ✅ Ve SOLO el chat de su proyecto
- ✅ No puede ver chats de otros proyectos
- ✅ Envío de mensajes con Enter o botón
- ✅ Actualización automática de mensajes

## 🎯 Resumen

El sistema de chat ahora:
1. ✅ Guarda mensajes en Supabase (tabla `messages`)
2. ✅ Admin ve todos los proyectos y puede chatear con cualquiera
3. ✅ Cliente ve solo el chat de su proyecto
4. ✅ Mensajes se identifican por `project_id` (no por cliente_id)
5. ✅ Diferenciación visual entre mensajes de admin y cliente
6. ✅ Timestamps y estados de lectura

---

**¿Necesitas ayuda?** Revisa la consola del navegador y los logs de Supabase para más detalles.
