# 🔧 Solución: Error "Failed to fetch" al crear cliente

## 🔴 Problema
Error al intentar crear un cliente desde el panel de admin:
```
Error al guardar el cliente: TypeError: Failed to fetch
```

## ✅ Solución

### Paso 1: Configurar Variables de Entorno

El error ocurre porque **no tienes configuradas las credenciales de Supabase**.

#### 1.1 Crear archivo `.env.local`
En la raíz del proyecto, crea un archivo llamado `.env.local` con este contenido:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-aqui
```

#### 1.2 Obtener las credenciales

1. Ve a https://supabase.com
2. Abre tu proyecto
3. Ve a **Settings** > **API**
4. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 1.3 Ejemplo de archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyMyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQwMDAwMDAwLCJleHAiOjE5NTU1NzYwMDB9.abc123xyz
```

### Paso 2: Reiniciar el servidor

Después de crear el archivo `.env.local`:

```bash
# Detener el servidor (Ctrl+C)
# Luego iniciar de nuevo:
npm run dev
```

### Paso 3: Verificar la conexión

1. Abre la consola del navegador (F12)
2. Intenta crear un cliente
3. Ahora debería funcionar correctamente

---

## 🔍 Otras posibles causas

### Si el error persiste después de configurar `.env.local`:

#### Causa 1: RLS (Row Level Security) mal configurado
**Solución:** Ejecuta este SQL en Supabase para permitir acceso a la tabla:

```sql
-- Verificar políticas existentes
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'clients';

-- Si no hay políticas, créalas:
CREATE POLICY "Enable all for all users" ON clients FOR ALL USING (true);
```

#### Causa 2: Tabla `clients` no existe
**Solución:** Ejecuta el script completo `supabase-setup.sql` en Supabase SQL Editor.

#### Causa 3: CORS o problemas de red
**Solución:** 
1. Verifica que tu proyecto de Supabase esté activo
2. Revisa la consola del navegador para más detalles del error
3. Asegúrate de estar conectado a internet

---

## ✅ Verificación final

Para confirmar que todo funciona:

```typescript
// Ejecuta esto en la consola del navegador
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
// Debe mostrar tu URL de Supabase

console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
// Debe mostrar tu clave (solo en desarrollo)
```

Si ves `undefined`, significa que las variables de entorno no se cargaron correctamente.

---

## 📝 Notas importantes

1. **Nunca** subas el archivo `.env.local` a Git (ya está en `.gitignore`)
2. El archivo `.env.local.example` es solo de referencia
3. Necesitas crear tu propio `.env.local` con tus credenciales reales
4. Reinicia el servidor Next.js después de crear el archivo

---

## 🎉 ¡Listo!

Después de seguir estos pasos, podrás crear clientes sin problemas.
