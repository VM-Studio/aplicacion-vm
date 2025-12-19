# 📊 Estructura de Base de Datos - VM Studio

## 🎯 Descripción General

Base de datos completa diseñada para gestionar proyectos, clientes, pagos, reuniones, presupuestos y más.

---

## 📁 Tablas del Sistema

### 1. **clients** - Clientes
Almacena información de todos los clientes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `nombre` | TEXT | Nombre del cliente |
| `rubro` | TEXT | Rubro o industria |
| `telefono` | TEXT | Número de teléfono |
| `email` | TEXT | Correo electrónico |
| `direccion` | TEXT | Dirección física |
| `notas` | TEXT | Notas adicionales |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de actualización |

---

### 2. **projects** - Proyectos
Proyectos asociados a clientes con seguimiento completo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `nombre` | TEXT | Nombre del proyecto |
| `cliente_id` | UUID | Referencia al cliente |
| `descripcion` | TEXT | Descripción detallada |
| `codigo` | TEXT | Código único del proyecto |
| `checklists` | JSONB | Tareas del proyecto |
| `fecha_estimada` | DATE | Fecha estimada de entrega |
| `fecha_inicio` | DATE | Fecha de inicio |
| `avance` | INTEGER | Porcentaje de avance (0-100) |
| `estado` | TEXT | Estado: pendiente, en_progreso, completado, cancelado |
| `prioridad` | TEXT | Prioridad: baja, media, alta, urgente |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de actualización |

---

### 3. **notifications** - Notificaciones
Sistema de notificaciones para admins y clientes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `titulo` | TEXT | Título de la notificación |
| `mensaje` | TEXT | Contenido del mensaje |
| `tipo` | TEXT | Tipo: info, success, warning, error |
| `destinatario` | TEXT | admin o cliente |
| `cliente_id` | UUID | Referencia al cliente (opcional) |
| `proyecto_id` | UUID | Referencia al proyecto (opcional) |
| `leido` | BOOLEAN | Estado de lectura |
| `created_at` | TIMESTAMP | Fecha de creación |

---

### 4. **payments** - Pagos
Gestión completa de pagos y facturación.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `proyecto_id` | UUID | Referencia al proyecto |
| `cliente_id` | UUID | Referencia al cliente |
| `monto` | DECIMAL | Monto del pago |
| `moneda` | TEXT | Moneda: ARS, USD, EUR |
| `concepto` | TEXT | Descripción del pago |
| `estado` | TEXT | Estado: pendiente, pagado, vencido, cancelado |
| `metodo_pago` | TEXT | efectivo, transferencia, tarjeta, mercadopago, otro |
| `fecha_vencimiento` | DATE | Fecha de vencimiento |
| `fecha_pago` | DATE | Fecha de pago efectivo |
| `comprobante_url` | TEXT | URL del comprobante |
| `notas` | TEXT | Notas adicionales |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de actualización |

---

### 5. **meetings** - Reuniones
Calendario de reuniones con clientes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `titulo` | TEXT | Título de la reunión |
| `descripcion` | TEXT | Descripción |
| `proyecto_id` | UUID | Referencia al proyecto |
| `cliente_id` | UUID | Referencia al cliente |
| `fecha_hora` | TIMESTAMP | Fecha y hora de la reunión |
| `duracion_minutos` | INTEGER | Duración en minutos |
| `ubicacion` | TEXT | Ubicación física |
| `link_reunion` | TEXT | Link para reunión virtual |
| `tipo` | TEXT | presencial, virtual, hibrida |
| `estado` | TEXT | programada, completada, cancelada, reprogramada |
| `participantes` | JSONB | Lista de participantes |
| `notas` | TEXT | Notas de la reunión |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de actualización |

---

### 6. **budgets** - Presupuestos
Sistema completo de presupuestos y cotizaciones.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `numero_presupuesto` | TEXT | Número único del presupuesto |
| `cliente_id` | UUID | Referencia al cliente |
| `proyecto_id` | UUID | Referencia al proyecto (opcional) |
| `titulo` | TEXT | Título del presupuesto |
| `descripcion` | TEXT | Descripción |
| `items` | JSONB | Items del presupuesto |
| `subtotal` | DECIMAL | Subtotal |
| `descuento` | DECIMAL | Descuento aplicado |
| `impuestos` | DECIMAL | Impuestos |
| `total` | DECIMAL | Total final |
| `moneda` | TEXT | Moneda: ARS, USD, EUR |
| `estado` | TEXT | borrador, enviado, aprobado, rechazado, vencido |
| `validez_dias` | INTEGER | Días de validez |
| `fecha_emision` | DATE | Fecha de emisión |
| `fecha_vencimiento` | DATE | Fecha de vencimiento |
| `fecha_aprobacion` | DATE | Fecha de aprobación |
| `notas` | TEXT | Notas adicionales |
| `terminos_condiciones` | TEXT | Términos y condiciones |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de actualización |

---

### 7. **documents** - Documentos
Gestión de archivos y documentos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `nombre` | TEXT | Nombre del archivo |
| `descripcion` | TEXT | Descripción |
| `tipo_archivo` | TEXT | Tipo de archivo |
| `tamaño_bytes` | BIGINT | Tamaño en bytes |
| `url` | TEXT | URL del archivo |
| `proyecto_id` | UUID | Referencia al proyecto |
| `cliente_id` | UUID | Referencia al cliente |
| `categoria` | TEXT | contrato, comprobante, diseño, documento, imagen, video, otro |
| `created_at` | TIMESTAMP | Fecha de creación |

---

### 8. **users** - Usuarios
Sistema de usuarios (admins y clientes).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `username` | TEXT | Nombre de usuario (único) |
| `password_hash` | TEXT | Hash de contraseña |
| `email` | TEXT | Correo electrónico (único) |
| `nombre_completo` | TEXT | Nombre completo |
| `rol` | TEXT | admin o cliente |
| `cliente_id` | UUID | Referencia al cliente (si aplica) |
| `activo` | BOOLEAN | Usuario activo/inactivo |
| `ultimo_acceso` | TIMESTAMP | Último inicio de sesión |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Fecha de actualización |

---

### 9. **activity_logs** - Logs de Actividad
Registro de todas las acciones en el sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `usuario_id` | UUID | Referencia al usuario |
| `accion` | TEXT | Acción realizada |
| `tabla_afectada` | TEXT | Tabla modificada |
| `registro_id` | UUID | ID del registro afectado |
| `detalles` | JSONB | Detalles adicionales |
| `ip_address` | TEXT | Dirección IP |
| `created_at` | TIMESTAMP | Fecha de creación |

---

## 🔗 Relaciones entre Tablas

```
clients (1) ──→ (N) projects
clients (1) ──→ (N) payments
clients (1) ──→ (N) meetings
clients (1) ──→ (N) budgets
clients (1) ──→ (N) documents
clients (1) ──→ (N) notifications
clients (1) ──→ (1) users

projects (1) ──→ (N) payments
projects (1) ──→ (N) meetings
projects (1) ──→ (N) documents
projects (1) ──→ (N) notifications
projects (1) ──→ (1) budgets

users (1) ──→ (N) activity_logs
```

---

## 🛠️ Vistas Útiles Creadas

### `v_projects_with_client`
Proyectos con información completa del cliente.

### `v_payments_with_details`
Pagos con información del proyecto y cliente.

### `v_unread_notifications`
Notificaciones no leídas ordenadas por fecha.

---

## 🚀 Instalación

1. Abre Supabase → SQL Editor
2. Copia y pega el contenido de `supabase-setup.sql`
3. Ejecuta el script completo
4. Verifica que todas las tablas se hayan creado correctamente

---

## 🔒 Seguridad

- **Row Level Security (RLS)** habilitado en todas las tablas
- Políticas básicas configuradas (ajustar según necesidades)
- Triggers automáticos para actualizar `updated_at`
- Índices optimizados para búsquedas rápidas

---

## 📝 Notas Importantes

1. **Usuarios de prueba**: El script incluye usuarios de prueba. Eliminarlos en producción.
2. **Contraseñas**: Actualmente se almacenan como texto plano (solo para desarrollo). Implementar hashing en producción.
3. **Políticas RLS**: Las políticas actuales son permisivas. Ajustar según roles y permisos.
4. **Validaciones**: Las tablas incluyen validaciones CHECK para integridad de datos.

---

## 🎨 Secciones de la Aplicación Cubiertas

✅ **Proyectos** - Gestión completa de proyectos
✅ **Notificaciones** - Sistema de notificaciones
✅ **Ver clientes** - Directorio de clientes
✅ **Ver Checklist** - Tareas de proyectos (JSONB en projects)
✅ **Pagos** - Gestión de facturación y pagos
✅ **Meetings** - Calendario de reuniones
✅ **Presupuesto** - Cotizaciones y presupuestos

---

## 📊 Próximos Pasos

1. Implementar autenticación con hash de contraseñas
2. Configurar políticas RLS específicas por rol
3. Implementar almacenamiento de archivos con Supabase Storage
4. Crear funciones serverless para lógica de negocio
5. Configurar webhooks para notificaciones en tiempo real

---

**Creado para VM Studio** 🎬
