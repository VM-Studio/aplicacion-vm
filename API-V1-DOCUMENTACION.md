# 🚀 API v1 - Documentación Completa

## ✅ Implementación Completada

Tu backend ahora tiene **8/8 requisitos de seguridad** cumplidos:

- ✅ **Stack sólido** (Next.js 16 + Node.js)
- ✅ **Validaciones server-side** (Zod con 7 schemas)
- ✅ **Error handling centralizado** (apiUtils.ts)
- ✅ **Logging estructurado** (Pino)
- ✅ **Auth con roles** (middleware.ts)
- ✅ **API versionada** (/api/v1) ← **NUEVO**
- ✅ **Rate limiting** (Upstash Redis) ← **NUEVO**
- ✅ **CORS configurado** (next.config.ts) ← **NUEVO**

---

## 📍 Endpoints Disponibles

### Base URL

```
Development: http://localhost:3000/api/v1
Production: https://tu-dominio.vercel.app/api/v1
```

### 1. Health Check

```bash
GET /api/v1/health
```

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "version": "1.0.0",
    "uptime": 3600,
    "environment": "development"
  },
  "version": "1.0.0"
}
```

### 2. Proyectos

#### Obtener todos los proyectos

```bash
GET /api/v1/projects
```

#### Crear proyecto

```bash
POST /api/v1/projects
Content-Type: application/json

{
  "nombre": "Proyecto Demo",
  "descripcion": "Descripción del proyecto",
  "cliente_id": "uuid-del-cliente",
  "estado": "activo"
}
```

#### Actualizar proyecto

```bash
PUT /api/v1/projects
Content-Type: application/json

{
  "id": "uuid-del-proyecto",
  "nombre": "Nombre actualizado",
  "estado": "completado"
}
```

#### Eliminar proyecto

```bash
DELETE /api/v1/projects?id=uuid-del-proyecto
```

### 3. Clientes

#### Obtener todos los clientes

```bash
GET /api/v1/clients
```

#### Crear cliente

```bash
POST /api/v1/clients
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "telefono": "+54 11 1234-5678",
  "rubro": "Tecnología"
}
```

#### Actualizar cliente

```bash
PUT /api/v1/clients
Content-Type: application/json

{
  "id": "uuid-del-cliente",
  "nombre": "Juan Pérez García",
  "telefono": "+54 11 9876-5432"
}
```

#### Eliminar cliente

```bash
DELETE /api/v1/clients?id=uuid-del-cliente
```

### 4. Mensajes

#### Obtener todos los mensajes

```bash
GET /api/v1/messages
```

#### Crear mensaje

```bash
POST /api/v1/messages
Content-Type: application/json

{
  "project_id": "uuid-del-proyecto",
  "sender": "admin",
  "content": "Mensaje de prueba",
  "type": "text"
}
```

#### Actualizar mensaje

```bash
PUT /api/v1/messages
Content-Type: application/json

{
  "id": "uuid-del-mensaje",
  "read": true
}
```

#### Eliminar mensaje

```bash
DELETE /api/v1/messages?id=uuid-del-mensaje
```

### 5. Pagos

#### Obtener todos los pagos

```bash
GET /api/v1/payments
```

#### Crear pago

```bash
POST /api/v1/payments
Content-Type: application/json

{
  "project_id": "uuid-del-proyecto",
  "monto": 50000,
  "estado": "pendiente",
  "fecha_vencimiento": "2024-02-01"
}
```

#### Actualizar pago

```bash
PUT /api/v1/payments
Content-Type: application/json

{
  "id": "uuid-del-pago",
  "estado": "pagado",
  "metodo_pago": "transferencia"
}
```

#### Eliminar pago

```bash
DELETE /api/v1/payments?id=uuid-del-pago
```

---

## 🔒 Rate Limiting

### Configuración

El rate limiting protege tu API contra abuso. Límites por minuto:

- **GET requests**: 100 por minuto
- **POST/PUT/DELETE**: 20 por minuto
- **Auth endpoints**: 5 por minuto

### Setup (REQUERIDO para producción)

1. **Crear cuenta en Upstash** (gratis):

   - Ir a https://console.upstash.com/
   - Crear nueva base de datos Redis
   - Copiar credenciales

2. **Configurar variables de entorno**:

   ```bash
   # .env.local
   UPSTASH_REDIS_REST_URL=https://tu-instancia.upstash.io
   UPSTASH_REDIS_REST_TOKEN=tu_token_aqui
   ```

3. **Verificar funcionamiento**:
   - Si las variables NO están configuradas, verás: `⚠️ Rate limiting deshabilitado`
   - Si están configuradas, verás headers en las respuestas:
     ```
     X-RateLimit-Limit: 100
     X-RateLimit-Remaining: 99
     X-RateLimit-Reset: 2024-01-15T10:31:00.000Z
     ```

### Headers de Rate Limiting

Cada respuesta incluye:

- `X-RateLimit-Limit`: Límite total de requests
- `X-RateLimit-Remaining`: Requests restantes
- `X-RateLimit-Reset`: Cuándo se reinicia el contador

### Respuesta cuando se excede el límite

```json
{
  "success": false,
  "error": "Demasiadas peticiones. Intenta de nuevo más tarde.",
  "retryAfter": 45
}
```

Status code: `429 Too Many Requests`

---

## 🌐 CORS

### Configuración

El CORS está configurado en `next.config.ts` para permitir:

- **Development**: `localhost:3000`, `127.0.0.1:3000`
- **Production**: Dominios específicos que agregues

### Modificar dominios permitidos

Editar `next.config.ts`:

```typescript
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://aplicacion-vm.vercel.app",
        "https://vm-studio.vercel.app",
        "https://tu-dominio.com", // ← Agregar aquí
      ]
    : ["http://localhost:3000", "http://127.0.0.1:3000"];
```

### Headers de seguridad incluidos

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## ✨ Validaciones

Todos los endpoints validan datos con **Zod** antes de procesarlos.

### Errores de validación

```json
{
  "success": false,
  "error": "Datos inválidos",
  "details": [
    {
      "path": ["email"],
      "message": "Email inválido"
    }
  ],
  "version": "1.0.0"
}
```

Status code: `400 Bad Request`

---

## 📊 Formato de Respuestas

### Respuesta exitosa

```json
{
  "success": true,
  "data": { ... },
  "version": "1.0.0"
}
```

### Respuesta con error

```json
{
  "success": false,
  "error": "Mensaje de error",
  "version": "1.0.0"
}
```

### Headers incluidos

```
API-Version: 1.0.0
Content-Type: application/json
```

---

## 🧪 Testing

### Con cURL

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Crear proyecto
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test Project",
    "cliente_id": "uuid-aqui",
    "estado": "activo"
  }'

# Obtener proyectos
curl http://localhost:3000/api/v1/projects
```

### Con JavaScript/TypeScript

```typescript
async function createProject(data: ProjectData) {
  const response = await fetch("/api/v1/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
}
```

---

## 🚀 Deploy a Producción

### 1. Configurar Upstash Redis

```bash
# En Vercel → Settings → Environment Variables
UPSTASH_REDIS_REST_URL=https://tu-instancia.upstash.io
UPSTASH_REDIS_REST_TOKEN=tu_token_aqui
```

### 2. Actualizar dominios CORS

En `next.config.ts`, agregar tus dominios de producción.

### 3. Deploy

```bash
git add .
git commit -m "feat: implement API v1 with rate limiting and CORS"
git push
```

Vercel detectará los cambios y desplegará automáticamente.

### 4. Verificar

```bash
# Health check en producción
curl https://tu-dominio.vercel.app/api/v1/health

# Ver rate limiting headers
curl -v https://tu-dominio.vercel.app/api/v1/projects
```

---

## 📝 Notas Importantes

### Endpoints antiguos

Los endpoints antiguos (sin `/v1`) siguen funcionando para backward compatibility:

- `/api/projects` → ⚠️ DEPRECADO, usar `/api/v1/projects`

### Logging

Todos los requests se registran automáticamente:

```
API Request: GET /api/v1/projects
API Response: GET /api/v1/projects - 200
```

### UUIDs

Todos los IDs deben ser UUIDs válidos. Ejemplo:

```
550e8400-e29b-41d4-a716-446655440000
```

### Desarrollo sin Redis

En desarrollo, si no configuras Upstash, verás:

```
⚠️ Rate limiting deshabilitado - Configura UPSTASH_REDIS_REST_URL...
```

Esto es normal. Para producción, **DEBES** configurar Upstash.

---

## 🎉 ¡Listo!

Tu API v1 está lista para producción con:

- ✅ Validación completa con Zod
- ✅ Rate limiting configurado
- ✅ CORS configurado
- ✅ Logging estructurado
- ✅ Manejo de errores robusto
- ✅ Versionado de API

**Próximos pasos:**

1. Configurar Upstash Redis (gratis)
2. Actualizar dominios CORS si es necesario
3. Deploy a Vercel
4. ¡Tu app está lista para producción! 🚀
