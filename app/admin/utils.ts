// Utilidades para el panel de admin
import { Task } from "./types";

export function generarCodigoUnico(): string {
  // Genera código de 8 caracteres alfanuméricos
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function calcularAvance(tasks: Task[]): number {
  const total = tasks.length;
  if (total === 0) return 0;
  const completadas = tasks.filter((t: Task) => t.checked).length;
  return Math.round((completadas / total) * 100);
}
