# Configuración de Pagos en VM Studio

## ✅ Funcionalidad Implementada

La página de **Pagos** ahora tiene funcionalidad completa con:

### Características principales:
- ✅ **Registro de pagos**: Botón "Nuevo Pago" para crear registros
- ✅ **Edición de pagos**: Botón editar (✏️) en cada fila
- ✅ **Eliminación de pagos**: Botón eliminar (🗑️) con confirmación
- ✅ **Exportar CSV**: Botón para exportar todos los pagos en formato CSV
- ✅ **Estadísticas en tiempo real**: 
  - Total Facturado
  - Total Cobrado
  - Total Pendiente
  - Total Vencido
- ✅ **Filtros avanzados**:
  - Búsqueda por proyecto/cliente
  - Filtro por estado (Todos, Pagado, Pendiente, Vencido)
  - Filtro por proyecto específico
- ✅ **Integración con Supabase**: CRUD completo con persistencia de datos

### Modal de Pago:
El modal incluye los siguientes campos:
- **Proyecto** (requerido): Dropdown con todos los proyectos disponibles
- **Monto** (requerido): Campo numérico para el monto del pago
- **Fecha de Pago** (requerido): Selector de fecha
- **Método de Pago** (requerido): Opciones disponibles:
  - Transferencia
  - Efectivo
  - Cheque
  - Tarjeta de Crédito
  - Tarjeta de Débito
  - MercadoPago
  - Otro
- **Estado** (requerido): Pendiente, Pagado, o Vencido
- **Descripción** (opcional): Texto libre para detalles adicionales

---

## 🗄️ Configuración de Base de Datos

### Paso 1: Acceder a Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Abre tu proyecto
3. Navega al **SQL Editor** en el menú lateral

### Paso 2: Crear la tabla de pagos
Ejecuta el siguiente SQL en el editor:

```sql
-- =====================================================
-- TABLA DE PAGOS
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proyecto_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  monto DECIMAL(10, 2) NOT NULL CHECK (monto > 0),
  fecha_pago DATE NOT NULL,
  metodo_pago TEXT NOT NULL,
  estado TEXT DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'Pagado', 'Vencido')),
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

### Paso 3: Habilitar Row Level Security
```sql
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
```

### Paso 4: Crear políticas de acceso
```sql
-- Políticas para PAYMENTS
CREATE POLICY "Enable read access for all users" ON payments FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON payments FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON payments FOR DELETE USING (true);
```

### Paso 5: Crear índices para mejor rendimiento
```sql
-- Índices para PAYMENTS
CREATE INDEX IF NOT EXISTS idx_payments_proyecto_id ON payments(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_payments_estado ON payments(estado);
CREATE INDEX IF NOT EXISTS idx_payments_fecha_pago ON payments(fecha_pago);
```

### Paso 6: Crear trigger para actualización automática
```sql
-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_payments_updated_at 
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Paso 7: Crear vista para consultas optimizadas (opcional)
```sql
-- Vista para pagos con información del proyecto y cliente
CREATE OR REPLACE VIEW v_payments_with_details AS
SELECT 
  pay.*,
  p.nombre as proyecto_nombre,
  p.codigo as proyecto_codigo,
  c.nombre as cliente_nombre,
  c.rubro as cliente_rubro
FROM payments pay
LEFT JOIN projects p ON pay.proyecto_id = p.id
LEFT JOIN clients c ON p.cliente_id = c.id;
```

---

## 🚀 Uso de la Funcionalidad

### Agregar un nuevo pago:
1. Haz clic en el botón **"Nuevo Pago"** (arriba a la derecha)
2. Completa el formulario del modal
3. Haz clic en **"Registrar Pago"**
4. El pago aparecerá inmediatamente en la tabla

### Editar un pago:
1. Haz clic en el ícono de editar (✏️) en la fila del pago
2. Modifica los campos necesarios en el modal
3. Haz clic en **"Actualizar Pago"**

### Eliminar un pago:
1. Haz clic en el ícono de eliminar (🗑️) en la fila del pago
2. Confirma la eliminación en el diálogo
3. El pago se eliminará de la base de datos

### Exportar datos:
1. Haz clic en el botón **"Exportar"** (arriba a la derecha)
2. Se descargará automáticamente un archivo CSV con todos los pagos

### Filtrar pagos:
- **Búsqueda**: Escribe en el campo de búsqueda para filtrar por proyecto o cliente
- **Por Estado**: Selecciona un estado en el dropdown (Todos, Pagado, Pendiente, Vencido)
- **Por Proyecto**: Selecciona un proyecto específico en el dropdown

---

## 📁 Archivos Modificados

### Nuevos archivos:
- `/app/admin/components/PaymentModal.tsx` - Modal para crear/editar pagos

### Archivos actualizados:
- `/app/admin/page.tsx` - Agregado estado, handlers y modal de pagos
- `/app/admin/components/pagos/PagosPage.tsx` - Agregada funcionalidad a todos los botones
- `/supabase-setup.sql` - Actualizada definición de tabla payments

---

## 🎨 Diseño y UX

- **Interfaz intuitiva**: Diseño coherente con el resto de la aplicación
- **Feedback visual**: Hover effects en todos los botones
- **Confirmaciones**: Diálogos de confirmación para acciones destructivas
- **Responsivo**: Se adapta a diferentes tamaños de pantalla
- **Estado vacío**: Mensaje motivacional cuando no hay pagos registrados
- **Formato de moneda**: Montos formateados como ARS (pesos argentinos)

---

## 🔄 Próximos Pasos

Si también quieres agregar funcionalidad completa a las secciones restantes:

1. **Meetings** - Sistema de gestión de reuniones
2. **Presupuestos** - Sistema de presupuestos y cotizaciones

Solo avísame y las implemento con el mismo nivel de detalle! 🚀
