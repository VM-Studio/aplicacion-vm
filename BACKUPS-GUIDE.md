# 📦 Configuración de Backups Automáticos - Supabase

## ✅ Backups Incluidos en Supabase

Supabase incluye backups automáticos en **todos los planes**, incluyendo el Free tier:

### Backups Automáticos por Plan:

| Plan           | Backups Diarios | Retención     | Point-in-Time Recovery |
| -------------- | --------------- | ------------- | ---------------------- |
| **Free**       | ✅ Sí           | 7 días        | ❌ No                  |
| **Pro**        | ✅ Sí           | 7 días        | ✅ Sí (7 días)         |
| **Team**       | ✅ Sí           | 14 días       | ✅ Sí (14 días)        |
| **Enterprise** | ✅ Sí           | Personalizado | ✅ Sí (Personalizado)  |

## 🔧 Configuración Automática

### Los backups están ACTIVADOS por defecto:

1. **Backups Diarios**:

   - Se ejecutan automáticamente cada día
   - Se almacenan en infraestructura de Supabase
   - No requieren configuración manual

2. **Point-in-Time Recovery (PITR)** (Pro y superiores):
   - Permite restaurar a cualquier momento específico
   - Útil para recuperación granular
   - Se configura desde el Dashboard

## 📊 Verificar Backups en Dashboard

### Paso 1: Acceder a la configuración

```
1. Ir a https://app.supabase.com
2. Seleccionar tu proyecto
3. Ir a Settings → Database
4. Sección "Backups"
```

### Paso 2: Ver historial de backups

- Lista de todos los backups disponibles
- Fecha y hora de cada backup
- Tamaño del backup
- Estado (exitoso/fallido)

## 🔄 Restaurar desde Backup

### Opción 1: Restaurar Backup Completo (Free/Pro/Team)

```
1. Dashboard → Settings → Database → Backups
2. Seleccionar el backup a restaurar
3. Clic en "Restore"
4. Confirmar la acción
⚠️ ADVERTENCIA: Esto SOBRESCRIBIRÁ tu base de datos actual
```

### Opción 2: Point-in-Time Recovery (Pro/Team/Enterprise)

```
1. Dashboard → Settings → Database → Backups
2. Sección "Point in Time Recovery"
3. Seleccionar fecha y hora específica
4. Clic en "Restore to this point"
5. Confirmar
```

## 💾 Backups Manuales Adicionales

### Método 1: Export desde Dashboard (Recomendado)

```bash
# 1. Dashboard → Database → Backups
# 2. Clic en "Export Database"
# 3. Se descarga un archivo .sql
```

### Método 2: pg_dump (CLI)

```bash
# Instalar PostgreSQL client tools
brew install postgresql  # macOS
# o
sudo apt-get install postgresql-client  # Linux

# Obtener connection string desde Dashboard
# Settings → Database → Connection String

# Ejecutar pg_dump
pg_dump \
  "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Método 3: Supabase CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Crear backup
supabase db dump \
  --project-ref [PROJECT_REF] \
  -f backup_$(date +%Y%m%d_%H%M%S).sql
```

## 🤖 Script de Backup Automatizado Local

### backup-database.sh

```bash
#!/bin/bash

# ============================================
# Script de Backup Automático - VM Studio
# ============================================

# Configuración
PROJECT_REF="tu-project-ref"
DB_PASSWORD="tu-password"
BACKUP_DIR="$HOME/vm-studio-backups"
RETENTION_DAYS=30

# Crear directorio si no existe
mkdir -p "$BACKUP_DIR"

# Nombre del archivo con timestamp
BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"

# Ejecutar backup
echo "🔄 Iniciando backup de base de datos..."
pg_dump \
  "postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres" \
  > "$BACKUP_FILE"

# Comprimir backup
echo "📦 Comprimiendo backup..."
gzip "$BACKUP_FILE"

# Eliminar backups antiguos (mayor a RETENTION_DAYS)
echo "🧹 Limpiando backups antiguos..."
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "✅ Backup completado: ${BACKUP_FILE}.gz"
echo "📊 Backups disponibles:"
ls -lh "$BACKUP_DIR"
```

### Hacer ejecutable y automatizar:

```bash
# Hacer ejecutable
chmod +x backup-database.sh

# Agregar a crontab para ejecutar diariamente a las 2 AM
crontab -e

# Agregar línea:
0 2 * * * /path/to/backup-database.sh >> /path/to/backup.log 2>&1
```

## ☁️ Backups en Cloud Storage

### Opción 1: Supabase Storage

```typescript
// backup-to-storage.ts
import { createClient } from "@supabase/supabase-js";
import { exec } from "child_process";
import { promisify } from "util";
import { readFileSync } from "fs";

const execAsync = promisify(exec);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ Server-side only
);

async function backupToStorage() {
  const timestamp = new Date().toISOString().split("T")[0];
  const filename = `backup_${timestamp}.sql`;

  // Crear backup local
  await execAsync(`pg_dump "..." > /tmp/${filename}`);

  // Leer archivo
  const fileData = readFileSync(`/tmp/${filename}`);

  // Subir a Supabase Storage
  const { data, error } = await supabase.storage
    .from("backups")
    .upload(filename, fileData);

  if (error) {
    console.error("Error subiendo backup:", error);
  } else {
    console.log("✅ Backup subido:", data);
  }
}
```

### Opción 2: AWS S3

```bash
# Instalar AWS CLI
brew install awscli

# Configurar credenciales
aws configure

# Script de backup a S3
pg_dump "..." | gzip | aws s3 cp - s3://mi-bucket/backups/backup_$(date +%Y%m%d).sql.gz
```

### Opción 3: Google Cloud Storage

```bash
# Instalar gsutil
# https://cloud.google.com/storage/docs/gsutil_install

# Backup a GCS
pg_dump "..." | gzip | gsutil cp - gs://mi-bucket/backups/backup_$(date +%Y%m%d).sql.gz
```

## 🔐 Seguridad de Backups

### 1. Cifrar Backups Locales

```bash
# Con GPG
pg_dump "..." | gzip | gpg --encrypt --recipient tu@email.com > backup.sql.gz.gpg

# Desencriptar
gpg --decrypt backup.sql.gz.gpg | gunzip | psql "..."
```

### 2. Variables de Entorno

```bash
# Nunca hardcodear passwords en scripts
# Usar .env o variables de entorno

export SUPABASE_DB_PASSWORD="tu-password"
export PROJECT_REF="tu-ref"
```

### 3. Permisos de Archivos

```bash
# Solo el usuario puede leer backups
chmod 600 backup_*.sql
chmod 700 backup-database.sh
```

## 🚨 Plan de Recuperación de Desastres

### Checklist de Recuperación:

1. **Identificar el problema**

   - ¿Qué datos se perdieron?
   - ¿Cuándo ocurrió?

2. **Seleccionar backup adecuado**

   - Backup más reciente antes del problema
   - O PITR al momento exacto

3. **Restaurar en ambiente de prueba PRIMERO**

   - Nunca restaurar directamente en producción
   - Verificar integridad de datos

4. **Validar restauración**

   - Verificar que los datos existen
   - Ejecutar queries de prueba
   - Verificar relaciones

5. **Aplicar a producción**
   - Notificar a usuarios (downtime)
   - Ejecutar restauración
   - Verificar funcionamiento

## 📋 Checklist de Backups

### Diario:

- [ ] Verificar que el backup automático se ejecutó
- [ ] Revisar logs de backup en Dashboard

### Semanal:

- [ ] Descargar backup manual
- [ ] Probar restauración en ambiente local
- [ ] Verificar espacio de almacenamiento

### Mensual:

- [ ] Revisar política de retención
- [ ] Limpiar backups antiguos
- [ ] Actualizar documentación
- [ ] Test de recuperación completa

## 🎯 Mejores Prácticas

1. **3-2-1 Rule**:

   - 3 copias de datos
   - 2 tipos de almacenamiento diferentes
   - 1 copia offsite

2. **Test de Restauración**:

   - Probar restauración regularmente
   - No confiar en backups no probados

3. **Monitoreo**:

   - Configurar alertas si falla backup
   - Revisar tamaño de backups (crecimiento anormal)

4. **Documentación**:

   - Mantener procedimientos actualizados
   - Entrenar al equipo en restauración

5. **Seguridad**:
   - Cifrar backups sensibles
   - Control de acceso a backups
   - Auditar acceso a backups

## 📞 Soporte

### Supabase Support:

- Dashboard → Help → Support
- Documentación: https://supabase.com/docs/guides/platform/backups
- Discord: https://discord.supabase.com

---

## ✅ Estado Actual de VM Studio

- ✅ **Backups automáticos**: ACTIVADOS por defecto en Supabase
- ✅ **Retención**: 7 días (Free tier) o más (planes pagos)
- ⚠️ **Backups locales**: Configurar script si se requiere
- ⚠️ **Cloud storage**: Opcional para redundancia extra

**¡Tus datos están protegidos! 🎉**
