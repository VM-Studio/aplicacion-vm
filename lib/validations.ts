import { z } from 'zod';

// ============================================
// AUTH SCHEMAS
// ============================================

export const loginSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(3, 'La contraseña debe tener al menos 3 caracteres'),
  isAdmin: z.boolean().optional().default(false),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  phone: z.string().regex(/^\d{8,15}$/, 'Teléfono inválido'),
  email: z.string().email('Email inválido').optional(),
});

// ============================================
// PROJECT SCHEMAS
// ============================================

export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  fecha_inicio: z.string().datetime(),
  fecha_estimada: z.string().datetime(),
  avance: z.number().min(0).max(100),
  cliente_id: z.string().uuid('ID de cliente inválido'),
  url_proyecto: z.string().url('URL inválida').optional(),
  codigo: z.string().length(8, 'El código debe tener 8 caracteres').optional(),
  checklists: z.array(
    z.object({
      id: z.string(),
      tarea: z.string().min(1),
      checked: z.boolean(),
    })
  ).optional(),
});

export const createProjectSchema = projectSchema.omit({ id: true });

export const updateProjectSchema = projectSchema.partial();

// ============================================
// CLIENT SCHEMAS
// ============================================

export const clientSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().regex(/^\d{8,15}$/, 'Teléfono inválido'),
  empresa: z.string().optional(),
  notas: z.string().optional(),
});

export const createClientSchema = clientSchema.omit({ id: true });

export const updateClientSchema = clientSchema.partial();

// ============================================
// MESSAGE SCHEMAS
// ============================================

export const messageSchema = z.object({
  id: z.string().uuid().optional(),
  project_id: z.string().uuid('ID de proyecto inválido'),
  sender: z.enum(['admin', 'client']),
  text: z.string().min(1, 'El mensaje no puede estar vacío').max(5000, 'El mensaje es demasiado largo'),
  read: z.boolean().optional().default(false),
  timestamp: z.string().datetime().optional(),
});

export const createMessageSchema = messageSchema.omit({ id: true, timestamp: true });

// ============================================
// PAYMENT SCHEMAS
// ============================================

export const paymentSchema = z.object({
  id: z.string().uuid().optional(),
  project_id: z.string().uuid('ID de proyecto inválido'),
  monto: z.number().positive('El monto debe ser positivo'),
  estado: z.enum(['pendiente', 'pagado', 'vencido']),
  fecha_vencimiento: z.string().datetime(),
  descripcion: z.string().optional(),
  metodo_pago: z.string().optional(),
  comprobante_url: z.string().url('URL inválida').optional(),
});

export const createPaymentSchema = paymentSchema.omit({ id: true });

export const updatePaymentSchema = paymentSchema.partial();

// ============================================
// MEETING SCHEMAS
// ============================================

export const meetingSchema = z.object({
  id: z.string().uuid().optional(),
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  descripcion: z.string().optional(),
  fecha_hora: z.string().datetime(),
  duracion_minutos: z.number().positive('La duración debe ser positiva'),
  proyecto_id: z.string().uuid('ID de proyecto inválido').optional(),
  cliente_id: z.string().uuid('ID de cliente inválido').optional(),
  ubicacion: z.string().optional(),
  link_reunion: z.string().url('URL inválida').optional(),
});

export const createMeetingSchema = meetingSchema.omit({ id: true });

export const updateMeetingSchema = meetingSchema.partial();

// ============================================
// NOTIFICATION SCHEMAS
// ============================================

export const notificationSchema = z.object({
  id: z.string().uuid().optional(),
  tipo: z.enum(['info', 'success', 'warning', 'error']),
  mensaje: z.string().min(1, 'El mensaje no puede estar vacío'),
  leido: z.boolean().optional().default(false),
  usuario_id: z.string().uuid('ID de usuario inválido'),
  metadata: z.record(z.string(), z.unknown()).optional(),
  created_at: z.string().datetime().optional(),
});

// ============================================
// TIPO HELPERS
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type Project = z.infer<typeof projectSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type Client = z.infer<typeof clientSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type Message = z.infer<typeof messageSchema>;
export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type Meeting = z.infer<typeof meetingSchema>;
export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;
export type UpdateMeetingInput = z.infer<typeof updateMeetingSchema>;
export type Notification = z.infer<typeof notificationSchema>;
