# 🚀 Guía Rápida de Despliegue - VM Studio PWA

## ✅ Pre-requisitos

Antes de desplegar, asegúrate de que:

- ✅ El proyecto compila sin errores: `npm run build`
- ✅ Tienes las variables de entorno de Supabase
- ✅ Has probado localmente con `npm start`
- ✅ Has hecho commit de todos los cambios

## 📱 Opción 1: Vercel (Recomendado) - 5 minutos

### Paso 1: Preparar el Repositorio

```bash
# Si no has inicializado git:
git init
git add .
git commit -m "Initial commit with PWA"

# Crear repositorio en GitHub y pushearlo
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

### Paso 2: Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en **"New Project"**
3. Importa tu repositorio de GitHub
4. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Haz clic en **"Deploy"**

¡Listo! Tu PWA estará disponible en:

- URL de producción: `https://tu-proyecto.vercel.app`
- HTTPS incluido automáticamente ✅
- Actualizaciones automáticas en cada push ✅

### Paso 3: Configurar Dominio Personalizado (Opcional)

1. En Vercel, ve a tu proyecto
2. Settings → Domains
3. Agrega tu dominio personalizado
4. Sigue las instrucciones de DNS

## 🌐 Opción 2: Netlify - 5 minutos

### Paso 1: Crear Archivo de Configuración

Crea `netlify.toml` en la raíz del proyecto:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Paso 2: Desplegar

1. Ve a [netlify.com](https://netlify.com)
2. Arrastra tu carpeta del proyecto o conecta GitHub
3. Configura las variables de entorno
4. Deploy

## 🔧 Opción 3: Docker - Para expertos

### Crear Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### Construir y Ejecutar

```bash
# Construir imagen
docker build -t vm-studio-pwa .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=tu_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key \
  vm-studio-pwa
```

## 🎯 Verificación Post-Despliegue

### 1. Verificar PWA

Abre Chrome DevTools en tu sitio:

```
1. F12 → Application
2. Manifest: Debe mostrar tu configuración
3. Service Workers: Debe mostrar activo
```

### 2. Lighthouse Audit

```
1. F12 → Lighthouse
2. Selecciona "Progressive Web App"
3. Click "Generate report"
4. Objetivo: Puntuación 80+ ✅
```

### 3. Probar Instalación

#### iOS:

1. Safari → Tu sitio
2. Compartir → Añadir a pantalla de inicio
3. Verificar que se instala correctamente

#### Android:

1. Chrome → Tu sitio
2. Menú → Instalar aplicación
3. Verificar instalación en cajón de apps

#### Desktop:

1. Chrome/Edge → Tu sitio
2. Icono (+) en barra de direcciones
3. Instalar

## 🔐 Variables de Entorno

Todas las plataformas necesitan estas variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica_anonima
```

### Dónde Conseguir las Variables:

1. Ve a [supabase.com](https://supabase.com)
2. Abre tu proyecto
3. Settings → API
4. Copia:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📊 Monitoreo

### Vercel Analytics (Gratis)

1. En tu proyecto de Vercel
2. Analytics → Enable
3. Verás:
   - Visitas
   - Rendimiento
   - Core Web Vitals

### Google Analytics (Opcional)

Agrega en `app/layout.tsx`:

```typescript
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

## 🔄 Actualizaciones

### Vercel/Netlify (Automático):

```bash
# Hacer cambios
git add .
git commit -m "Descripción de cambios"
git push

# ¡Deploy automático! ✅
```

### Manual:

```bash
# Recompilar
npm run build

# Re-desplegar según tu plataforma
```

## 🎨 Personalización Post-Despliegue

### Cambiar Iconos:

1. Actualiza `public/icon-192x192.png` y `public/icon-512x512.png`
2. Commit y push
3. Los usuarios verán el nuevo icono en próxima instalación

### Cambiar Nombre de la App:

1. Edita `public/manifest.json`
2. Commit y push
3. Los usuarios deben reinstalar para ver el cambio

### Cambiar Theme Color:

1. Edita `public/manifest.json` y `app/layout.tsx`
2. Commit y push
3. Cambio visible inmediatamente

## 🐛 Solución de Problemas

### "PWA no se instala en producción"

✅ Verifica:

- HTTPS está activo (Vercel lo tiene automáticamente)
- `manifest.json` es accesible: `https://tu-sitio.com/manifest.json`
- Service worker activo en DevTools

### "Los cambios no se reflejan"

✅ Soluciones:

- Espera 5-10 minutos para propagación de CDN
- Limpia caché del navegador
- Abre en modo incógnito

### "Error 404 en rutas"

✅ Agrega en `next.config.ts`:

```typescript
{
  trailingSlash: true,
  output: 'standalone',
}
```

## 📱 Promocionar tu PWA

### 1. Añadir Badge en tu Sitio

```html
<button onclick="installPWA()">📱 Instalar App</button>
```

### 2. Compartir Links de Instalación

- iOS: `https://tu-sitio.com` (instrucciones en el sitio)
- Android: `https://tu-sitio.com` (prompt automático)

### 3. QR Code

Genera un QR code con tu URL y compártelo para instalación rápida.

## 🎉 ¡Listo!

Tu PWA ahora está:

- ✅ Desplegada y accesible mundialmente
- ✅ Instalable en todos los dispositivos
- ✅ Con HTTPS automático
- ✅ Actualizable con cada push
- ✅ Monitoreada y optimizada

**¿Problemas?** Revisa:

1. `PWA-GUIDE.md` - Guía completa de PWA
2. `PWA-COMPLETE.md` - Estado de implementación
3. Chrome DevTools → Application → Service Workers

**¡Disfruta tu aplicación multiplataforma en producción! 🚀**
