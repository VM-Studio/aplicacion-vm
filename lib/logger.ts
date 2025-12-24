import pino from 'pino';

// Configuración del logger
const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  browser: {
    asObject: true,
  },
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});

// Helper functions para diferentes niveles de log
export const log = {
  debug: (message: string, data?: object) => {
    logger.debug(data || {}, message);
  },

  info: (message: string, data?: object) => {
    logger.info(data || {}, message);
  },

  warn: (message: string, data?: object) => {
    logger.warn(data || {}, message);
  },

  error: (message: string, error?: Error | unknown, data?: object) => {
    logger.error(
      {
        ...data,
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        } : error,
      },
      message
    );
  },

  // Para requests API
  request: (method: string, url: string, data?: object) => {
    logger.info(
      {
        type: 'request',
        method,
        url,
        ...data,
      },
      `API Request: ${method} ${url}`
    );
  },

  // Para responses API
  response: (method: string, url: string, status: number, data?: object) => {
    const level = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info';
    logger[level](
      {
        type: 'response',
        method,
        url,
        status,
        ...data,
      },
      `API Response: ${method} ${url} - ${status}`
    );
  },

  // Para operaciones de base de datos
  database: (operation: string, table: string, data?: object) => {
    logger.debug(
      {
        type: 'database',
        operation,
        table,
        ...data,
      },
      `DB ${operation}: ${table}`
    );
  },

  // Para auth operations
  auth: (action: string, userId?: string, data?: object) => {
    logger.info(
      {
        type: 'auth',
        action,
        userId,
        ...data,
      },
      `Auth: ${action}`
    );
  },
};

export default logger;
