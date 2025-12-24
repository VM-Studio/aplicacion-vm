# Guía de Progressive Web App (PWA) - VM Studio

## ✅ ¿Qué es una PWA?

Una Progressive Web App permite que tu aplicación web funcione como una aplicación nativa en cualquier dispositivo:

- **📱 iOS/iPhone/iPad**: Se instala desde Safari como una app nativa
- **🤖 Android**: Se instala desde Chrome/Edge como una app nativa
- **💻 Desktop**: Se instala en Windows, macOS, Linux desde cualquier navegador moderno

## 🎯 Ventajas

- ✅ **Instalación**: Los usuarios pueden instalar la app en su dispositivo
- ✅ **Icono en pantalla**: Aparece como cualquier otra app nativa
- ✅ **Sin barra del navegador**: Se ejecuta en modo standalone (pantalla completa)
- ✅ **Caché inteligente**: Funciona offline y carga más rápido
- ✅ **Actualizaciones automáticas**: Se actualiza en segundo plano
- ✅ **Compatible**: Funciona en TODOS los sistemas operativos

## 📲 Cómo Instalar la PWA

### En iOS (iPhone/iPad)

1. Abre **Safari** y ve a tu sitio web
2. Toca el botón de **Compartir** (📤) en la barra inferior
3. Desplázate hacia abajo y toca **"Añadir a pantalla de inicio"**
4. Ingresa un nombre (opcional) y toca **"Añadir"**
5. La app aparecerá en tu pantalla de inicio

### En Android

1. Abre **Chrome** y ve a tu sitio web
2. Toca el menú (⋮) en la esquina superior derecha
3. Selecciona **"Agregar a pantalla de inicio"** o **"Instalar aplicación"**
4. Confirma la instalación
5. La app aparecerá en tu cajón de aplicaciones

### En Desktop (Windows/Mac/Linux)

#### Chrome/Edge/Brave:

1. Ve a tu sitio web
2. Busca el icono de **instalación** (+) en la barra de direcciones
3. Haz clic en **"Instalar"**
4. La app se instalará como una aplicación de escritorio

#### Safari (Mac):

1. Ve a tu sitio web
2. Menú **Archivo** → **"Añadir a Dock"**

## 🔧 Configuración Técnica

### Archivos PWA Generados

- `/public/manifest.json` - Configuración de la PWA
- `/public/sw.js` - Service Worker (gestión de caché)
- `/public/icon-192x192.png` - Icono pequeño (Android)
- `/public/icon-512x512.png` - Icono grande (splash screen)
- `/app/components/PWAInstallPrompt.tsx` - Prompt de instalación

### Caché y Offline

La PWA cachea automáticamente:

- ✅ Fuentes de Google (1 año)
- ✅ Imágenes estáticas (24 horas)
- ✅ JavaScript y CSS (24 horas)
- ✅ Respuestas de API (5 minutos)

### Modo de Desarrollo

En desarrollo (`npm run dev`), la PWA está **deshabilitada** para facilitar el desarrollo.

### Modo de Producción

Para probar la PWA localmente:

```bash
# 1. Compilar
npm run build

# 2. Iniciar servidor de producción
npm start

# 3. Abrir en navegador
http://localhost:3000
```

## 🧪 Probar la Instalación

### En Chrome DevTools:

1. Abre DevTools (F12)
2. Ve a la pestaña **"Application"**
3. En el menú lateral, busca **"Service Workers"**
4. Verifica que el service worker esté activo
5. En **"Manifest"**, verifica la configuración de la PWA

### Verificar Prompt de Instalación:

- El prompt aparece automáticamente en navegadores compatibles
- Si lo descartas, no volverá a aparecer por 24 horas
- Puedes limpiar el localStorage para que vuelva a aparecer

## 🚀 Despliegue en Producción

### Vercel/Netlify/Render:

1. Haz commit de todos los cambios
2. Push a GitHub
3. La plataforma compilará automáticamente con `npm run build`
4. La PWA estará disponible inmediatamente

### Requisitos:

- ✅ **HTTPS obligatorio**: Las PWAs solo funcionan con HTTPS (localhost está exento)
- ✅ Los iconos deben estar accesibles públicamente
- ✅ El manifest.json debe ser servido con el tipo MIME correcto

## 🔄 Actualizaciones

Cuando haces cambios:

1. Los usuarios que ya instalaron la app recibirán la actualización automáticamente
2. El service worker detecta nuevas versiones
3. La actualización se aplica en la próxima visita

## 📊 Estadísticas de Compatibilidad

- ✅ **iOS 11.3+**: Safari (95%+ de dispositivos iOS)
- ✅ **Android 5.0+**: Chrome, Edge, Samsung Internet (99%+ de dispositivos Android)
- ✅ **Chrome/Edge Desktop**: Windows 7+, macOS 10.11+, Linux
- ✅ **Safari Desktop**: macOS 10.15+

## ❓ Solución de Problemas

### "No veo el botón de instalación"

- Verifica que estés usando HTTPS (o localhost)
- Revisa que el manifest.json esté cargando correctamente
- Algunos navegadores solo muestran el prompt después de cierta interacción

### "La app no funciona offline"

- El service worker necesita tiempo para cachear el contenido
- Visita la app al menos una vez con conexión
- Verifica en DevTools → Application → Cache Storage

### "Los cambios no se reflejan"

- El service worker cachea contenido agresivamente
- En DevTools → Application → Service Workers, haz clic en "Unregister"
- O activa "Update on reload" durante el desarrollo

## 📱 Características Adicionales Futuras

Puedes agregar:

- 🔔 **Push Notifications**: Notificaciones push
- 📍 **Background Sync**: Sincronización en segundo plano
- 📶 **Offline Mode**: Página fallback cuando no hay conexión
- 🔄 **Update Notifications**: Notificar al usuario cuando hay una nueva versión

## 🎨 Personalización

### Cambiar Iconos:

1. Reemplaza `/public/icon-192x192.png` y `/public/icon-512x512.png`
2. Usa imágenes cuadradas (1:1)
3. Fondo no transparente recomendado
4. Re-compila: `npm run build`

### Cambiar Tema:

Edita `/public/manifest.json`:

```json
{
  "theme_color": "#TU_COLOR",
  "background_color": "#TU_COLOR"
}
```

### Cambiar Nombre:

Edita `/public/manifest.json`:

```json
{
  "name": "Tu Nombre Completo",
  "short_name": "Nombre Corto"
}
```

## 📚 Recursos

- [PWA Builder](https://www.pwabuilder.com/) - Herramientas y validación
- [Web.dev PWA](https://web.dev/progressive-web-apps/) - Guías oficiales de Google
- [Can I Use PWA](https://caniuse.com/serviceworkers) - Compatibilidad de navegadores

---

**¡Tu aplicación ahora funciona en todos los dispositivos como una app nativa! 🎉**
