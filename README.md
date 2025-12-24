# VM Studio - Plataforma de Gestión de Proyectos

> 🚀 **Progressive Web App** - Funciona en iOS, Android, Windows, macOS y Linux

Una plataforma profesional y elegante para la gestión de proyectos, clientes, pagos y comunicación. Diseñada con un enfoque en la simplicidad y la eficiencia.

## ✨ Características

- 📱 **PWA Completa**: Instálala como app nativa en cualquier dispositivo
- 🎨 **Diseño Responsivo**: Optimizado para móvil, tablet y desktop
- 👥 **Doble Panel**: Administración para el equipo y panel para clientes
- 📊 **Gestión de Proyectos**: Crea, edita y monitorea proyectos en tiempo real
- ✅ **Sistema de Checklist**: Organiza tareas por proyecto
- 💬 **Mensajería Integrada**: Comunicación directa con clientes
- 💰 **Seguimiento de Pagos**: Gestiona facturación y pagos
- 🎯 **Sin base de datos local**: Usa Supabase para sincronización en la nube

## 🚀 Inicio Rápido

### Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir http://localhost:3000
```

### Producción

```bash
# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 📱 Progressive Web App

Esta aplicación es una PWA completa que funciona en **todos los dispositivos**:

- ✅ iPhone/iPad (iOS 11.3+)
- ✅ Android (5.0+)
- ✅ Windows Desktop
- ✅ macOS Desktop
- ✅ Linux Desktop

### Instalar como App Nativa

#### iOS (Safari):

1. Toca el botón Compartir (📤)
2. Selecciona "Añadir a pantalla de inicio"

#### Android (Chrome):

1. Toca el menú (⋮)
2. Selecciona "Instalar aplicación"

#### Desktop:

1. Busca el icono (+) en la barra de direcciones
2. Haz clic en "Instalar"

📖 **Guía completa**: Lee `PWA-GUIDE.md` y `PWA-COMPLETE.md`

## 🛠️ Tecnologías

- **Framework**: Next.js 16.1.0 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Base de Datos**: Supabase
- **PWA**: @ducanh2912/next-pwa
- **Iconos**: react-icons
- **Fuentes**: Google Fonts (Inter, Geist)

## 📂 Estructura del Proyecto

```
aplicacion-vm/
├── app/
│   ├── admin/              # Panel de administración
│   │   └── components/     # Componentes del admin
│   ├── cliente/            # Panel de clientes
│   │   └── components/     # Componentes del cliente
│   ├── auth/               # Autenticación
│   ├── actions/            # Server Actions (Supabase)
│   ├── components/         # Componentes compartidos
│   ├── hooks/              # Custom hooks
│   └── lib/                # Utilidades y configuración
├── public/
│   ├── manifest.json       # Configuración PWA
│   ├── sw.js              # Service Worker
│   ├── icon-*.png         # Iconos de la app
│   └── assets/            # Imágenes y recursos
└── next.config.ts         # Configuración de Next.js + PWA
```

## 🎨 Paneles

### Panel de Administración (`/admin`)

- 📊 Dashboard con estadísticas
- 📁 Gestión de proyectos
- 👥 Administración de clientes
- ✅ Sistema de checklist
- 💬 Centro de mensajes
- 💰 Control de pagos

### Panel de Cliente (`/cliente`)

- 📱 Vista móvil optimizada
- 📂 Mis proyectos
- ✅ Tareas asignadas
- 💬 Mensajes con el equipo
- 💳 Estado de pagos

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

### Personalización

#### Cambiar Colores:

Edita `public/manifest.json`:

```json
{
  "theme_color": "#TU_COLOR",
  "background_color": "#TU_COLOR"
}
```

#### Cambiar Iconos:

1. Reemplaza `public/icon-192x192.png` y `public/icon-512x512.png`
2. Usa imágenes cuadradas (1:1)
3. Ejecuta `npm run build`

## 📦 Scripts Disponibles

```bash
npm run dev      # Desarrollo (PWA deshabilitada)
npm run build    # Compilar para producción
npm start        # Servidor de producción
npm run lint     # Verificar código
```

## 🌐 Despliegue

### Vercel (Recomendado)

1. Haz push a GitHub
2. Importa el proyecto en Vercel
3. Configura las variables de entorno
4. ¡Deploy automático!

La PWA funciona automáticamente con el HTTPS de Vercel.

### Otras Plataformas

- **Netlify**: Compatible ✅
- **Render**: Compatible ✅
- **AWS/Azure**: Compatible con configuración adicional

⚠️ **Requisito**: HTTPS es obligatorio para PWAs (Vercel lo incluye automáticamente)

## 🎯 Características Responsivas

### Mobile (< 768px)

- Sidebar lateral deslizable
- Botón FAB para navegación
- Grids de 1-2 columnas
- Navegación optimizada para pulgar

### Tablet (768px - 1024px)

- Sidebar colapsable
- Grids de 2-3 columnas
- Balance entre móvil y desktop

### Desktop (> 1024px)

- Sidebar permanente con toggle
- Grids de 3-4 columnas
- Vista completa de todas las funciones

## 🔐 Seguridad

- ✅ Autenticación con Supabase
- ✅ Variables de entorno protegidas
- ✅ HTTPS obligatorio en producción
- ✅ Service Worker con scope limitado

## 📊 Rendimiento

- ⚡ Caché inteligente con Service Worker
- ⚡ Imágenes optimizadas (AVIF/WebP)
- ⚡ Carga instantánea después de primera visita
- ⚡ Funciona con conexión lenta o intermitente

## 🆘 Soporte

### Problemas Comunes

**La PWA no se instala:**

- Verifica que estés usando HTTPS o localhost
- Revisa Chrome DevTools → Application → Manifest

**Los cambios no se reflejan:**

- Limpia el caché del navegador
- DevTools → Application → Service Workers → Unregister

**Errores de compilación:**

- Ejecuta `npm install` nuevamente
- Verifica Node.js versión 18+

📖 Más ayuda en: `PWA-GUIDE.md`

## 📝 Licencia

Este proyecto es privado y confidencial.

## 👨‍💻 Desarrollado con

- ❤️ Next.js y React
- ☕ TypeScript
- 🎨 Tailwind CSS
- ⚡ Supabase
- 🚀 PWA Technology

---

**¿Preguntas?** Consulta la documentación en `/docs` o abre un issue.

**¡Disfruta tu plataforma multiplataforma! 🎉**
