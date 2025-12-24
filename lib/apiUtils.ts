import { log } from './logger';
import { toast } from '@/app/components/Toast';

// Tipos de respuesta estándar
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

// Clase personalizada de error
export class AppError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Wrapper para fetch con manejo de errores
export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const startTime = Date.now();
  const method = options.method || 'GET';

  try {
    // Log request
    log.request(method, url, {
      headers: options.headers,
      body: options.body ? 'presente' : undefined,
    });

    // Hacer request
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const duration = Date.now() - startTime;

    // Parse response
    let data: unknown;
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Log response
    log.response(method, url, response.status, {
      duration: `${duration}ms`,
      contentType,
    });

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      const error: ApiError = {
        message: typeof data === 'object' && data && 'message' in data
          ? (data as { message: string }).message
          : 'Error en la solicitud',
        status: response.status,
        details: data,
      };

      throw new AppError(
        error.message,
        error.status,
        undefined,
        error.details
      );
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    // Log error
    log.error('API request failed', error, {
      method,
      url,
      duration: `${duration}ms`,
    });

    if (error instanceof AppError) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'Error desconocido',
      };
    }

    return {
      success: false,
      error: 'Error desconocido en la solicitud',
    };
  }
}

// Helper para manejar errores en Server Actions
export function handleServerError(error: unknown): ApiResponse {
  log.error('Server action error', error);

  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: process.env.NODE_ENV === 'development'
        ? error.message
        : 'Error en el servidor',
    };
  }

  return {
    success: false,
    error: 'Error desconocido',
  };
}

// Helper para manejar errores en componentes
export function handleClientError(error: unknown, showToast: boolean = true): string {
  let message = 'Ocurrió un error inesperado';

  if (error instanceof AppError) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  log.error('Client error', error);

  if (showToast) {
    toast.error(message);
  }

  return message;
}

// Wrapper para try-catch con logging
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorMessage: string = 'Error en la operación'
): Promise<[T | null, Error | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    log.error(errorMessage, error);
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

// Validar respuesta de Supabase
export function validateSupabaseResponse<T>(
  data: T | null,
  error: { message: string } | null
): ApiResponse<T> {
  if (error) {
    log.error('Supabase error', error);
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    data: data || undefined,
  };
}

// Retry logic para operaciones críticas
export async function retryOperation<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      log.warn(`Operation failed, attempt ${attempt}/${maxRetries}`, {
        error: lastError.message,
      });

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  throw lastError!;
}

// Debounce para optimizar requests
export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Throttle para limitar frecuencia de requests
export function throttle<T extends (...args: Parameters<T>) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Type guards
export function isApiResponse<T>(response: unknown): response is ApiResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    typeof (response as ApiResponse).success === 'boolean'
  );
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
