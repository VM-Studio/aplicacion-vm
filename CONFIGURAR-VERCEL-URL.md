# Configurar URL de Vercel para el proyecto

## Opción 1: Desde Supabase Dashboard

1. Ve a https://wqeedxakkfoszvshfrhs.supabase.co
2. Navega a **Table Editor** → **projects**
3. Busca el proyecto con código "TH9YCA"
4. Edita el campo `url_proyecto` y agrega tu URL de Vercel

## Opción 2: Desde SQL Editor

1. Ve a **SQL Editor** en Supabase
2. Ejecuta este query (reemplaza la URL con tu URL real de Vercel):

```sql
UPDATE projects
SET url_proyecto = 'https://tu-sitio.vercel.app'
WHERE codigo = 'TH9YCA';
```

## Opción 3: Desde el Panel de Admin

También puedes agregar la URL desde el panel de admin:
1. Ve a http://localhost:3000/admin
2. Selecciona el proyecto
3. En la sección "Mi Proyecto", busca el campo "URL del Proyecto"
4. Agrega la URL de Vercel ahí

## Formato de la URL

La URL debe tener este formato:
- `https://tu-proyecto.vercel.app`
- `https://tu-proyecto-git-main-usuario.vercel.app`
- O cualquier dominio personalizado

## Verificación

Una vez agregada la URL:
1. Ve al panel del cliente: http://localhost:3000/cliente
2. Ingresa el código "TH9YCA"
3. Deberías ver el botón azul "Ver mi Web en Vivo" en la esquina inferior derecha
