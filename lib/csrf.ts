/**
 * CSRF Protection Utilities
 * Protección contra Cross-Site Request Forgery
 */

import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = 'csrf-token';

/**
 * Generar un token CSRF aleatorio
 */
export function generateCsrfToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

/**
 * Obtener o crear token CSRF para la sesión actual
 */
export async function getCsrfToken(): Promise<string> {
  const cookieStore = await cookies();
  let token = cookieStore.get(CSRF_COOKIE_NAME)?.value;

  if (!token) {
    token = generateCsrfToken();
    cookieStore.set(CSRF_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 horas
    });
  }

  return token;
}

/**
 * Verificar que el token CSRF del request coincide con el de la cookie
 */
export async function verifyCsrfToken(requestToken: string): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE_NAME)?.value;

  if (!cookieToken || !requestToken) {
    return false;
  }

  // Comparación constant-time para prevenir timing attacks
  return timingSafeEqual(Buffer.from(cookieToken), Buffer.from(requestToken));
}

/**
 * Comparación constant-time para prevenir timing attacks
 */
function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }

  return result === 0;
}

/**
 * Middleware para validar CSRF en requests
 * Usar en API routes que modifican datos (POST, PUT, DELETE, PATCH)
 */
export async function validateCsrfMiddleware(request: Request): Promise<{ valid: boolean; error?: string }> {
  const method = request.method;

  // Solo validar en métodos que modifican datos
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    return { valid: true };
  }

  // Obtener token del header
  const headerToken = request.headers.get('X-CSRF-Token');
  
  // O del body (para form submissions)
  let bodyToken: string | null = null;
  try {
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const body = await request.clone().json();
      bodyToken = body._csrf;
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await request.clone().formData();
      bodyToken = formData.get('_csrf') as string;
    }
  } catch {
    // Si no se puede parsear, continuar sin body token
  }

  const requestToken = headerToken || bodyToken;

  if (!requestToken) {
    return { valid: false, error: 'CSRF token missing' };
  }

  const isValid = await verifyCsrfToken(requestToken);

  if (!isValid) {
    return { valid: false, error: 'CSRF token invalid' };
  }

  return { valid: true };
}

/**
 * Hook para React components - obtener CSRF token para forms
 */
export async function getCsrfTokenForClient(): Promise<string> {
  return getCsrfToken();
}
