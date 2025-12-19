# 💬 CONFIGURACIÓN DE CHAT - Guía Rápida

## 🚀 Opción 1: Ejecutar todo de una vez (RECOMENDADO)

1. Ve a **Supabase.com** → Tu proyecto → **SQL Editor**
2. Copia TODO el contenido del archivo `sql-mensajes-chat.sql`
3. Pégalo en el editor SQL
4. Haz clic en **"Run"** o presiona **Ctrl/Cmd + Enter**
5. ¡Listo! ✅

---

## 📝 Opción 2: Paso a paso (Más seguro)

### PASO 1: Crear la tabla de mensajes

```sql
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  sender VARCHAR(10) NOT NULL CHECK (sender IN ('client', 'admin')),
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

✅ **Verificar**: Ve a Table Editor → deberías ver la tabla `messages`

---

### PASO 2: Crear índices

```sql
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender);
CREATE INDEX IF NOT EXISTS idx_messages_project_sender_read ON messages(project_id, sender, read);
```

✅ **Verificar**: Los índices mejoran el rendimiento de las consultas

---

### PASO 3: Configurar seguridad (RLS)

```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to messages" ON messages;
DROP POLICY IF EXISTS "Allow public insert to messages" ON messages;
DROP POLICY IF EXISTS "Allow public update to messages" ON messages;

CREATE POLICY "Allow public read access to messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert to messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update to messages" ON messages FOR UPDATE USING (true) WITH CHECK (true);
```

✅ **Verificar**: Ve a Authentication → Policies → deberías ver las políticas de `messages`

---

### PASO 4: Trigger para actualizar fecha

```sql
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS messages_updated_at_trigger ON messages;

CREATE TRIGGER messages_updated_at_trigger
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_messages_updated_at();
```

✅ **Verificar**: El trigger actualiza `updated_at` automáticamente

---

## 🧪 Prueba rápida

Para verificar que todo funciona, ejecuta:

```sql
-- Ver la estructura de la tabla
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'messages';

-- Debería mostrar: id, project_id, sender, text, timestamp, read, created_at, updated_at
```

---

## ✅ ¿Qué hace esto?

1. **Tabla `messages`**: Almacena todos los mensajes del chat
2. **Campo `sender`**: Indica quién envió el mensaje (`'client'` o `'admin'`)
3. **Campo `read`**: Indica si el mensaje fue leído (`true`/`false`)
4. **Campo `project_id`**: Relaciona el mensaje con un proyecto específico
5. **Timestamp**: Fecha y hora del mensaje
6. **Políticas RLS**: Permite que cliente y admin lean y escriban mensajes

---

## 📊 Cómo funciona el flujo:

1. **Cliente envía mensaje** → Se guarda con `sender = 'client'` y `read = false`
2. **Admin ve el mensaje** → Lo marca como leído con `read = true`
3. **Admin responde** → Se guarda con `sender = 'admin'` y `read = false`
4. **Cliente ve la respuesta** → Lo marca como leído con `read = true`

---

## 🔍 Consultas útiles después de configurar:

```sql
-- Ver todos los mensajes
SELECT * FROM messages ORDER BY timestamp DESC;

-- Ver mensajes no leídos del admin
SELECT * FROM messages WHERE sender = 'client' AND read = false;

-- Ver mensajes no leídos del cliente
SELECT * FROM messages WHERE sender = 'admin' AND read = false;
```

---

## 🎉 ¡Listo!

Ahora el chat funcionará correctamente:
- ✅ Cliente puede enviar mensajes al admin
- ✅ Admin puede responder
- ✅ Se guardan en la base de datos
- ✅ Sistema de mensajes leídos/no leídos
- ✅ Todo sincronizado en tiempo real

---

## ⚠️ Problemas comunes:

**Error: "relation already exists"**
→ La tabla ya existe, está bien, continúa con el siguiente paso

**Error: "permission denied"**
→ Verifica que estés usando la API Key correcta en `.env.local`

**Los mensajes no aparecen**
→ Verifica que el `project_id` en los mensajes coincida con el ID del proyecto
