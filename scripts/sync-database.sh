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
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directorio de backups
BACKUP_DIR="$(pwd)/backups"
mkdir -p "$BACKUP_DIR"

# Función de ayuda
show_help() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  Script de Sincronización de Base de Datos - VM Studio ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Uso: ./sync-database.sh [COMANDO] [ORIGEN] [DESTINO] [OPCIONES]"
    echo ""
    echo -e "${GREEN}Comandos:${NC}"
    echo "  schema     Sincronizar solo schema (estructura)"
    echo "  data       Sincronizar solo datos"
    echo "  full       Sincronizar schema + datos"
    echo "  verify     Verificar diferencias entre entornos"
    echo ""
    echo -e "${GREEN}Entornos:${NC}"
    echo "  dev        Development (local)"
    echo "  staging    Staging (pre-producción)"
    echo "  prod       Production (CUIDADO!)"
    echo ""
    echo -e "${GREEN}Opciones:${NC}"
    echo "  --dry-run  Mostrar qué se haría sin ejecutar"
    echo "  --no-backup  No crear backup antes de aplicar cambios"
    echo ""
    echo -e "${YELLOW}Ejemplos:${NC}"
    echo "  ./sync-database.sh schema dev staging"
    echo "  ./sync-database.sh full staging prod"
    echo "  ./sync-database.sh verify dev staging --dry-run"
    echo ""
}

# Función para log con timestamp
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"
}

log_error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ❌ $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️  $1${NC}"
}

# Función para obtener connection string
get_connection_string() {
    local env=$1
    local conn_string=""
    
    case $env in
        dev)
            if [ -f ".env.local" ]; then
                source .env.local
                # Extraer connection string de Supabase
                # Formato: postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
                local ref=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's/https:\/\///' | sed 's/.supabase.co//')
                # Necesitas el password de Supabase
                log_warn "Para dev, necesitas el password de la base de datos"
                echo "Ver en: Supabase Dashboard → Settings → Database → Connection string"
                read -sp "Password de dev: " password
                echo ""
                conn_string="postgresql://postgres:${password}@db.${ref}.supabase.co:5432/postgres"
            else
                log_error "Archivo .env.local no encontrado"
                exit 1
            fi
            ;;
        staging)
            if [ -f ".env.staging" ]; then
                source .env.staging
                local ref=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's/https:\/\///' | sed 's/.supabase.co//')
                log_warn "Para staging, necesitas el password de la base de datos"
                read -sp "Password de staging: " password
                echo ""
                conn_string="postgresql://postgres:${password}@db.${ref}.supabase.co:5432/postgres"
            else
                log_error "Archivo .env.staging no encontrado"
                exit 1
            fi
            ;;
        prod)
            if [ -f ".env.production" ]; then
                source .env.production
                local ref=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's/https:\/\///' | sed 's/.supabase.co//')
                log_warn "Para prod, necesitas el password de la base de datos"
                read -sp "Password de prod: " password
                echo ""
                conn_string="postgresql://postgres:${password}@db.${ref}.supabase.co:5432/postgres"
            else
                log_error "Archivo .env.production no encontrado"
                exit 1
            fi
            ;;
        *)
            log_error "Entorno desconocido: $env"
            exit 1
            ;;
    esac
    
    echo "$conn_string"
}

# Función para verificar si pg_dump y psql están instalados
check_dependencies() {
    if ! command -v pg_dump &> /dev/null; then
        log_error "pg_dump no está instalado"
        echo "Instalar con: brew install postgresql (macOS)"
        exit 1
    fi
    
    if ! command -v psql &> /dev/null; then
        log_error "psql no está instalado"
        echo "Instalar con: brew install postgresql (macOS)"
        exit 1
    fi
}

# Función para crear backup
create_backup() {
    local env=$1
    local conn_string=$2
    local backup_file="${BACKUP_DIR}/backup_${env}_$(date +%Y%m%d_%H%M%S).sql"
    
    log "Creando backup de $env..."
    pg_dump "$conn_string" > "$backup_file"
    gzip "$backup_file"
    
    log "✅ Backup creado: ${backup_file}.gz"
    echo "$backup_file.gz"
}

# Función para exportar schema
export_schema() {
    local env=$1
    local conn_string=$2
    local schema_file="${BACKUP_DIR}/schema_${env}_$(date +%Y%m%d_%H%M%S).sql"
    
    log "Exportando schema de $env..."
    pg_dump "$conn_string" --schema-only --no-owner --no-privileges > "$schema_file"
    
    log "✅ Schema exportado: $schema_file"
    echo "$schema_file"
}

# Función para exportar datos
export_data() {
    local env=$1
    local conn_string=$2
    local data_file="${BACKUP_DIR}/data_${env}_$(date +%Y%m%d_%H%M%S).sql"
    
    log "Exportando datos de $env..."
    pg_dump "$conn_string" --data-only --no-owner --no-privileges > "$data_file"
    
    log "✅ Datos exportados: $data_file"
    echo "$data_file"
}

# Función para aplicar SQL file
apply_sql() {
    local conn_string=$1
    local sql_file=$2
    local env=$3
    
    log "Aplicando cambios a $env..."
    psql "$conn_string" -f "$sql_file"
    
    log "✅ Cambios aplicados a $env"
}

# Función principal
main() {
    # Verificar argumentos
    if [ "$#" -lt 1 ]; then
        show_help
        exit 1
    fi
    
    local comando=$1
    local origen=$2
    local destino=$3
    local dry_run=false
    local no_backup=false
    
    # Parse opciones
    for arg in "$@"; do
        case $arg in
            --dry-run)
                dry_run=true
                ;;
            --no-backup)
                no_backup=true
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
        esac
    done
    
    # Verificar comando
    case $comando in
        schema|data|full|verify)
            ;;
        *)
            log_error "Comando desconocido: $comando"
            show_help
            exit 1
            ;;
    esac
    
    # Verificar entornos
    if [[ ! "$origen" =~ ^(dev|staging|prod)$ ]] || [[ ! "$destino" =~ ^(dev|staging|prod)$ ]]; then
        log_error "ORIGEN y DESTINO deben ser dev, staging, o prod"
        show_help
        exit 1
    fi
    
    if [ "$origen" == "$destino" ]; then
        log_error "ORIGEN y DESTINO no pueden ser iguales"
        exit 1
    fi
    
    # Advertencia para producción
    if [ "$destino" == "prod" ]; then
        echo ""
        echo -e "${RED}╔══════════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║                    ⚠️  ADVERTENCIA  ⚠️                     ║${NC}"
        echo -e "${RED}║                                                          ║${NC}"
        echo -e "${RED}║  Vas a modificar la base de datos de PRODUCCIÓN         ║${NC}"
        echo -e "${RED}║  Esta acción puede afectar a usuarios reales            ║${NC}"
        echo -e "${RED}║                                                          ║${NC}"
        echo -e "${RED}╚══════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${YELLOW}Por favor, confirma que:${NC}"
        echo "  1. Has probado los cambios en staging"
        echo "  2. Tienes un backup reciente"
        echo "  3. Es un horario de bajo tráfico"
        echo ""
        read -p "Escribir 'CONFIRMO PRODUCCION' para continuar: " confirm
        if [ "$confirm" != "CONFIRMO PRODUCCION" ]; then
            log "Cancelado por el usuario"
            exit 0
        fi
    fi
    
    # Verificar dependencias
    check_dependencies
    
    # Obtener connection strings
    log "Conectando a $origen..."
    origen_conn=$(get_connection_string "$origen")
    
    log "Conectando a $destino..."
    destino_conn=$(get_connection_string "$destino")
    
    # Dry run
    if [ "$dry_run" = true ]; then
        log_warn "Modo DRY RUN - No se realizarán cambios"
        log "Se haría: $comando de $origen → $destino"
        exit 0
    fi
    
    # Crear backup del destino
    if [ "$no_backup" = false ]; then
        backup_file=$(create_backup "$destino" "$destino_conn")
        log "Backup del destino guardado en: $backup_file"
    fi
    
    # Ejecutar comando
    case $comando in
        schema)
            schema_file=$(export_schema "$origen" "$origen_conn")
            apply_sql "$destino_conn" "$schema_file" "$destino"
            log "✅ Schema sincronizado: $origen → $destino"
            ;;
        data)
            data_file=$(export_data "$origen" "$origen_conn")
            apply_sql "$destino_conn" "$data_file" "$destino"
            log_warn "⚠️  Datos sincronizados. Puede haber sobrescrito datos existentes."
            ;;
        full)
            backup_file_full="${BACKUP_DIR}/full_${origen}_$(date +%Y%m%d_%H%M%S).sql"
            log "Exportando backup completo de $origen..."
            pg_dump "$origen_conn" --no-owner --no-privileges > "$backup_file_full"
            apply_sql "$destino_conn" "$backup_file_full" "$destino"
            log "✅ Sincronización completa: $origen → $destino"
            ;;
        verify)
            schema_origen=$(export_schema "$origen" "$origen_conn")
            schema_destino=$(export_schema "$destino" "$destino_conn")
            
            log "Comparando schemas..."
            if diff "$schema_origen" "$schema_destino" > /dev/null; then
                log "✅ Los schemas son idénticos"
            else
                log_warn "❌ Los schemas son diferentes"
                log "Diferencias guardadas en: ${BACKUP_DIR}/diff_${origen}_${destino}.txt"
                diff "$schema_origen" "$schema_destino" > "${BACKUP_DIR}/diff_${origen}_${destino}.txt" || true
            fi
            ;;
    esac
    
    log "✅ Proceso completado exitosamente"
}

# Ejecutar
main "$@"
