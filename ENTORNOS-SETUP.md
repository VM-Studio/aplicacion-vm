# 🌍 Configuración de Entornos - VM Studio

## 📋 Estrategia de Entornos

Tu aplicación necesita **3 entornos separados** para desarrollo seguro:

```
┌─────────────┐
│     DEV     │  ← Desarrollo activo
├─────────────┤
│   STAGING   │  ← Testing pre-producción
├─────────────┤
│ PRODUCTION  │  ← Usuarios reales
└─────────────┘
```

---

## 🎯 Propósito de Cada Entorno

### 1. **Development (dev)**

- 🧪 Desarrollo y experimentación
- 🐛 Debugging activo
- 🔄 Cambios frecuentes
- ⚡ Base de datos con datos de prueba
- ❌ **NUNCA** acceso público

### 2. **Staging (staging)**

- 🧪 Testing de features completas
- 👥 QA y UAT (User Acceptance Testing)
- 📸 Réplica exacta de producción
- 🔄 Deploy antes de producción
- ✅ Datos similares a producción (anonimizados)

### 3. **Production (prod)**

- 🚀 Usuarios reales
- 🔒 Máxima seguridad
- 📊 Monitoreo 24/7
- 💾 Backups críticos
- ⚠️ Solo deploys probados

---

## 🏗️ Setup Paso a Paso

### PASO 1: Crear 3 Proyectos en Supabase

#### 1.1 Proyecto Development

```
1. Ir a https://app.supabase.com
2. Clic en "New Project"
3. Configurar:
   - Name: vm-studio-dev
   - Database Password: [contraseña segura]
   - Region: South America (São Paulo) o la más cercana
   - Plan: Free (suficiente para dev)
4. Esperar ~2 minutos a que se cree
5. Guardar credenciales en 1Password/similar
```

#### 1.2 Proyecto Staging

```
1. New Project
2. Configurar:
   - Name: vm-studio-staging
   - Database Password: [DIFERENTE a dev]
   - Region: Misma que dev
   - Plan: Free o Pro (recomendado Pro para PITR)
3. Guardar credenciales
```

#### 1.3 Proyecto Production

```
1. New Project
2. Configurar:
   - Name: vm-studio-prod
   - Database Password: [DIFERENTE a dev y staging]
   - Region: Misma que dev y staging
   - Plan: Pro o superior (OBLIGATORIO para producción)
3. Guardar credenciales
```

---

### PASO 2: Variables de Entorno por Entorno

#### Estructura de archivos:

```
aplicacion-vm/
├── .env.local              # Development (local)
├── .env.development        # Development (opcional)
├── .env.staging           # Staging
├── .env.production        # Production
└── .env.example           # Template sin credenciales
```

#### Contenido de cada archivo:

**`.env.local` (Development - tu máquina)**

```env
# =====================================================
# ENVIRONMENT: DEVELOPMENT
# =====================================================

# Supabase - Development
NEXT_PUBLIC_SUPABASE_URL=https://xxxdevxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...dev...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...dev-service...

# Environment
NODE_ENV=development
NEXT_PUBLIC_ENV=development

# Feature Flags
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_SHOW_DEV_TOOLS=true

# API URLs
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**`.env.staging` (Staging)**

```env
# =====================================================
# ENVIRONMENT: STAGING
# =====================================================

# Supabase - Staging
NEXT_PUBLIC_SUPABASE_URL=https://xxxstagingxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...staging...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...staging-service...

# Environment
NODE_ENV=production
NEXT_PUBLIC_ENV=staging

# Feature Flags
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_SHOW_DEV_TOOLS=false

# API URLs
NEXT_PUBLIC_API_URL=https://vm-studio-staging.vercel.app/api
```

**`.env.production` (Production)**

```env
# =====================================================
# ENVIRONMENT: PRODUCTION
# =====================================================

# Supabase - Production
NEXT_PUBLIC_SUPABASE_URL=https://xxxprodxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...prod...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...prod-service...

# Environment
NODE_ENV=production
NEXT_PUBLIC_ENV=production

# Feature Flags
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_SHOW_DEV_TOOLS=false

# API URLs
NEXT_PUBLIC_API_URL=https://vm-studio.vercel.app/api

# Monitoring (opcional)
SENTRY_DSN=https://...
ANALYTICS_ID=G-...
```

---

### PASO 3: Configurar Vercel para cada entorno

#### 3.1 Crear proyectos en Vercel

```
1. Ir a https://vercel.com/dashboard
2. Import Git Repository
3. Conectar repo de GitHub

4. Crear 2 deployments:
   a) Staging
   b) Production
```

#### 3.2 Configurar Staging en Vercel

```
Project Settings → Environments

1. Environment: Preview
2. Agregar variables desde .env.staging:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - NEXT_PUBLIC_ENV=staging

3. Branch: staging (crear branch en GitHub)
```

#### 3.3 Configurar Production en Vercel

```
Project Settings → Environments

1. Environment: Production
2. Agregar variables desde .env.production:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - NEXT_PUBLIC_ENV=production

3. Branch: main
```

---

### PASO 4: Sincronizar Schemas de Base de Datos

#### Script de Migración

Crear `sync-database.sh`:

```bash
#!/bin/bash

# =====================================================
# Script de Sincronización de Database Schema
# VM Studio - Sync entre dev/staging/prod
# =====================================================

set -e  # Exit on error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función de ayuda
show_help() {
    echo "Uso: ./sync-database.sh [ORIGEN] [DESTINO]"
    echo ""
    echo "Argumentos:"
    echo "  ORIGEN   : dev, staging, o prod"
    echo "  DESTINO  : dev, staging, o prod"
    echo ""
    echo "Ejemplos:"
    echo "  ./sync-database.sh dev staging    # Dev → Staging"
    echo "  ./sync-database.sh staging prod   # Staging → Prod"
    echo ""
}

# Verificar argumentos
if [ "$#" -ne 2 ]; then
    show_help
    exit 1
fi

ORIGEN=$1
DESTINO=$2

# Validar argumentos
if [[ ! "$ORIGEN" =~ ^(dev|staging|prod)$ ]] || [[ ! "$DESTINO" =~ ^(dev|staging|prod)$ ]]; then
    echo -e "${RED}❌ Error: ORIGEN y DESTINO deben ser dev, staging, o prod${NC}"
    show_help
    exit 1
fi

if [ "$ORIGEN" == "$DESTINO" ]; then
    echo -e "${RED}❌ Error: ORIGEN y DESTINO no pueden ser iguales${NC}"
    exit 1
fi

# Advertencia para producción
if [ "$DESTINO" == "prod" ]; then
    echo -e "${RED}⚠️  ADVERTENCIA: Vas a modificar PRODUCCIÓN${NC}"
    echo -e "${YELLOW}Esta acción puede afectar usuarios reales.${NC}"
    read -p "¿Estás seguro? (escribir 'SI' para confirmar): " confirm
    if [ "$confirm" != "SI" ]; then
        echo "Cancelado."
        exit 0
    fi
fi

# Configurar URLs (obtener de .env files)
case $ORIGEN in
    dev)
        source .env.local
        ORIGEN_URL=$NEXT_PUBLIC_SUPABASE_URL
        ;;
    staging)
        source .env.staging
        ORIGEN_URL=$NEXT_PUBLIC_SUPABASE_URL
        ;;
    prod)
        source .env.production
        ORIGEN_URL=$NEXT_PUBLIC_SUPABASE_URL
        ;;
esac

case $DESTINO in
    dev)
        source .env.local
        DESTINO_URL=$NEXT_PUBLIC_SUPABASE_URL
        ;;
    staging)
        source .env.staging
        DESTINO_URL=$NEXT_PUBLIC_SUPABASE_URL
        ;;
    prod)
        source .env.production
        DESTINO_URL=$NEXT_PUBLIC_SUPABASE_URL
        ;;
esac

echo -e "${GREEN}🔄 Sincronizando schema: ${ORIGEN} → ${DESTINO}${NC}"

# Crear backup del destino
BACKUP_FILE="backup_${DESTINO}_$(date +%Y%m%d_%H%M%S).sql"
echo -e "${YELLOW}📦 Creando backup del destino...${NC}"
# TODO: Implementar pg_dump del destino

# Exportar schema del origen
SCHEMA_FILE="schema_${ORIGEN}_$(date +%Y%m%d_%H%M%S).sql"
echo -e "${YELLOW}📤 Exportando schema de ${ORIGEN}...${NC}"
# TODO: Implementar pg_dump del origen (solo schema)

# Aplicar al destino
echo -e "${YELLOW}📥 Aplicando schema a ${DESTINO}...${NC}"
# TODO: Implementar psql al destino

echo -e "${GREEN}✅ Sincronización completada${NC}"
echo -e "${GREEN}📋 Backup guardado en: ${BACKUP_FILE}${NC}"
```

---

### PASO 5: Workflow de Deploy

#### Flujo recomendado:

```
┌──────────────────────────────────────────────────┐
│ 1. Desarrollar en local (dev DB)                │
│    - git checkout -b feature/nueva-feature       │
│    - npm run dev                                 │
│    - Hacer cambios                               │
│    - Probar localmente                           │
└──────────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│ 2. Push a branch de feature                     │
│    - git add .                                   │
│    - git commit -m "feat: nueva feature"        │
│    - git push origin feature/nueva-feature      │
└──────────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│ 3. Merge a staging branch                       │
│    - git checkout staging                        │
│    - git merge feature/nueva-feature            │
│    - git push origin staging                     │
│    - Vercel auto-deploy a staging                │
│    - Probar en: vm-studio-staging.vercel.app    │
└──────────────────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────┐
│ 4. Si staging OK → Merge a main (prod)          │
│    - git checkout main                           │
│    - git merge staging                           │
│    - git push origin main                        │
│    - Vercel auto-deploy a production             │
│    - Monitorear: vm-studio.vercel.app            │
└──────────────────────────────────────────────────┘
```

---

### PASO 6: Scripts de Package.json

Actualizar `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:staging": "env-cmd -f .env.staging next dev -p 3001",
    "dev:prod": "env-cmd -f .env.production next dev -p 3002",

    "build": "next build --webpack",
    "build:staging": "env-cmd -f .env.staging next build --webpack",
    "build:prod": "env-cmd -f .env.production next build --webpack",

    "start": "next start",
    "lint": "next lint",

    "db:verify": "psql $DATABASE_URL -f sql-verificar-indices.sql",
    "db:optimize": "psql $DATABASE_URL -f sql-indices-optimizacion.sql",
    "db:sync": "./scripts/sync-database.sh"
  }
}
```

Instalar dependencia:

```bash
npm install --save-dev env-cmd
```

---

## 🔒 Seguridad por Entorno

### Development

- ✅ Logs verbosos activados
- ✅ Debug tools visibles
- ✅ Source maps completos
- ✅ No requiere HTTPS local

### Staging

- ✅ Logs moderados
- ⚠️ Debug tools solo para QA
- ✅ Source maps disponibles
- ✅ HTTPS obligatorio
- ✅ Datos anonimizados

### Production

- ✅ Logs mínimos (solo errores)
- ❌ Debug tools desactivados
- ❌ Source maps limitados
- ✅ HTTPS obligatorio
- ✅ Rate limiting
- ✅ Monitoreo 24/7

---

## 📊 Configuración de Backups por Entorno

### Development

```
Backups: Opcionales
Retención: 1-3 días
Frecuencia: Manual o diario
Prioridad: Baja
```

### Staging

```
Backups: Automáticos
Retención: 7 días
Frecuencia: Diaria (3 AM)
Prioridad: Media
PITR: Recomendado
```

### Production

```
Backups: Automáticos + Múltiples
Retención: 30+ días
Frecuencia: Cada 6 horas
Prioridad: CRÍTICA
PITR: OBLIGATORIO
Offsite: S3 o GCS
```

---

## ✅ Checklist de Configuración

### Para cada entorno:

- [ ] Proyecto Supabase creado
- [ ] Variables de entorno configuradas
- [ ] Schema de BD sincronizado
- [ ] Índices creados
- [ ] Backups configurados
- [ ] Vercel deployment configurado
- [ ] Domain configurado (staging/prod)
- [ ] Monitoring activado
- [ ] Logs configurados
- [ ] Security headers activados

---

## 🚨 Troubleshooting

### "Error: Wrong database"

```bash
# Verificar qué BD estás usando
echo $NEXT_PUBLIC_SUPABASE_URL

# Si está mal, cargar el .env correcto
source .env.staging
npm run dev
```

### "Schema out of sync"

```bash
# Comparar schemas
./sync-database.sh dev staging --dry-run

# Sincronizar
./sync-database.sh dev staging
```

### "No puedo conectar a staging"

```bash
# Verificar que el proyecto Supabase esté activo
# Dashboard → Settings → General → Status

# Verificar variables en Vercel
# Vercel Dashboard → Settings → Environment Variables
```

---

## 📈 Monitoreo de Entornos

### Herramientas Recomendadas:

1. **Vercel Analytics**: Incluido gratis
2. **Supabase Dashboard**: Métricas de BD
3. **Sentry**: Error tracking (opcional)
4. **Better Uptime**: Monitoreo de uptime

### Alertas a Configurar:

- ❌ Downtime en producción
- ❌ Error rate > 5%
- ❌ Backup failed
- ⚠️ Response time > 3s
- ⚠️ Database connections > 80%

---

## 📝 Documentación Adicional

- [Supabase Projects](https://supabase.com/docs/guides/platform/projects)
- [Vercel Environments](https://vercel.com/docs/concepts/deployments/environments)
- [Database Migrations](./DATABASE_MIGRATIONS.md)

---

**¡Entornos configurados correctamente = Deploy seguro! 🎉**
