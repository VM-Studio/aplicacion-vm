import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Configurar Redis (si no tienes Upstash Redis configurado, usa in-memory para desarrollo)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : undefined;

// Configuraciones de rate limiting por tipo de operación
export const rateLimits = {
  // GET - más permisivo (100 requests por minuto)
  read: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'),
        analytics: true,
      })
    : null,

  // POST, PUT, DELETE - más restrictivo (20 requests por minuto)
  write: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '1 m'),
        analytics: true,
      })
    : null,

  // AUTH - muy restrictivo (5 intentos por minuto)
  auth: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1 m'),
        analytics: true,
      })
    : null,
};

/**
 * Obtener el identificador único para rate limiting
 * Usa IP o userId dependiendo de si está autenticado
 */
export function getRateLimitIdentifier(request: NextRequest): string {
  // Priorizar userId si está autenticado
  const userId = request.cookies.get('userId')?.value;
  if (userId) {
    return `user:${userId}`;
  }

  // Fallback a IP
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
  return `ip:${ip}`;
}

/**
 * Aplicar rate limiting a una request
 */
export async function applyRateLimit(
  request: NextRequest,
  type: 'read' | 'write' | 'auth' = 'read'
): Promise<{ success: boolean; response?: NextResponse }> {
  // Si no hay Redis configurado (desarrollo), permitir todo
  if (!redis) {
    console.warn('⚠️  Rate limiting deshabilitado - Configura UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN');
    return { success: true };
  }

  const ratelimit = rateLimits[type];
  if (!ratelimit) {
    return { success: true };
  }

  const identifier = getRateLimitIdentifier(request);
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);

  // Headers de rate limiting (siguiendo estándar RateLimit)
  const headers = {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(reset).toISOString(),
  };

  if (!success) {
    return {
      success: false,
      response: NextResponse.json(
        {
          success: false,
          error: 'Demasiadas peticiones. Intenta de nuevo más tarde.',
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers,
        }
      ),
    };
  }

  return { success: true };
}

/**
 * Middleware helper para aplicar rate limiting
 */
export async function withRateLimit(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  type: 'read' | 'write' | 'auth' = 'read'
): Promise<NextResponse> {
  const result = await applyRateLimit(request, type);
  
  if (!result.success && result.response) {
    return result.response;
  }

  return handler();
}
