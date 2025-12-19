// Tipos de datos para el sistema admin
export type SidebarSection = "Proyectos" | "Notificaciones" | "Ver clientes" | "Ver Checklist" | "Pagos" | "Meetings" | "Presupuesto" | "Modificaciones";

export interface Client {
  id: string;
  nombre: string;
  rubro: string;
  telefono: string;
  email: string;
  direccion?: string;
  notas?: string;
}

export interface Project {
  id: string;
  nombre: string;
  cliente_id: string;
  descripcion: string;
  codigo: string;
  checklists: Task[];
  fecha_estimada?: string;
  fecha_inicio?: string;
  avance?: number;
  estado?: string;
  prioridad?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  nombre: string;
  descripcion: string;
  asignado: string;
  checked: boolean;
}

export interface ClientForm {
  id: string;
  nombre: string;
  rubro: string;
  telefono: string;
  email: string;
  direccion: string;
  notas: string;
}

export interface ProjectForm {
  nombre: string;
  cliente_id: string;
  descripcion: string;
  fecha_estimada: string;
  url_vercel: string;
}
