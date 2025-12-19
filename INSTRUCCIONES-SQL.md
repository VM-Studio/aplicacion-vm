# 🔧 Instrucciones para Configurar Códigos de Proyecto en Supabase

## ⚠️ IMPORTANTE: Ejecutar en Orden

Ejecuta estos archivos SQL **uno por uno** en el **SQL Editor de Supabase**, en el orden indicado.

---

## 📝 Paso a Paso

### **PASO 1: Agregar Columna** ✅
**Archivo:** `sql-paso-1-agregar-columna.sql`

```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS codigo_proyecto TEXT;
```

**Qué hace:** Agrega la columna `codigo_proyecto` a la tabla `projects`.

**Verificación:** Debes ver que la columna se creó correctamente.

---

### **PASO 2: Crear Función** 🔧
**Archivo:** `sql-paso-2-crear-funcion.sql`

```sql
CREATE OR REPLACE FUNCTION generate_project_code() RETURNS TEXT
```

**Qué hace:** Crea la función que genera códigos únicos de 8 caracteres.

**Verificación:** La función debe aparecer en la lista de funciones.

---

### **PASO 3: Generar Códigos** 🎯
**Archivo:** `sql-paso-3-generar-codigos.sql`

```sql
UPDATE projects SET codigo_proyecto = generate_project_code() 
WHERE codigo_proyecto IS NULL OR codigo_proyecto = '';
```

**Qué hace:** Genera códigos para todos los proyectos existentes que no tienen.

**Verificación:** Verás una lista de proyectos con sus códigos generados.

---

### **PASO 4: Crear Trigger** ⚡
**Archivo:** `sql-paso-4-crear-trigger.sql`

```sql
CREATE TRIGGER trigger_set_project_code
```

**Qué hace:** Configura el trigger para que los nuevos proyectos generen código automáticamente.

**Verificación:** El trigger debe aparecer en la lista de triggers.

---

### **PASO 5: Optimización (Opcional)** 🚀
**Archivo:** `sql-paso-5-optimizacion.sql`

```sql
ALTER TABLE projects ADD CONSTRAINT projects_codigo_proyecto_key UNIQUE
CREATE INDEX idx_projects_codigo
```

**Qué hace:** Agrega constraint UNIQUE para evitar códigos duplicados y crea índice para búsquedas rápidas.

**Verificación:** Verás el constraint y el índice creados.

---

## ✅ Verificación Final

Después de ejecutar todos los pasos, ejecuta esto para verificar:

```sql
-- Ver todos los proyectos con sus códigos
SELECT 
  id,
  nombre,
  codigo_proyecto,
  created_at
FROM projects
ORDER BY created_at DESC;

-- Verificar que todos tienen código de 8 caracteres
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN LENGTH(codigo_proyecto) = 8 THEN 1 END) as con_codigo_8_chars
FROM projects;
```

**Resultado esperado:**
- ✅ Todos los proyectos deben tener un `codigo_proyecto`
- ✅ Todos los códigos deben tener exactamente 8 caracteres
- ✅ Todos los códigos deben ser únicos

---

## 🎉 ¡Listo!

Ahora:
1. Los clientes pueden ingresar con su código de 8 caracteres
2. Los nuevos proyectos generarán código automáticamente
3. El modal del panel de cliente funcionará correctamente

---

## ❌ Si algo falla

### Error: "column already exists"
**Solución:** Salta ese paso, la columna ya existe.

### Error: "function already exists"
**Solución:** Continúa, la función se reemplazó con `CREATE OR REPLACE`.

### Error: "constraint already exists"
**Solución:** Salta el Paso 5, los constraints ya existen.

### No se generan códigos
**Solución:** Verifica que ejecutaste el Paso 2 antes del Paso 3.

---

## 📞 Debug

Si necesitas ver el estado actual:

```sql
-- Ver estructura de la tabla
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects';

-- Ver funciones
SELECT proname FROM pg_proc WHERE proname LIKE '%project%';

-- Ver triggers
SELECT tgname FROM pg_trigger WHERE tgrelid = 'projects'::regclass;
```
