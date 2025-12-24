'use client';

import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { log } from '@/lib/logger';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f6f7fa',
        padding: '24px',
      }}
    >
      <div
        style={{
          maxWidth: '500px',
          width: '100%',
          background: '#fff',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 2px 24px rgba(0,0,0,0.08)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(220, 38, 38, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <span style={{ fontSize: '32px' }}>⚠️</span>
        </div>

        <h2
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#111',
            marginBottom: '12px',
          }}
        >
          Algo salió mal
        </h2>

        <p
          style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '24px',
            lineHeight: '1.6',
          }}
        >
          {process.env.NODE_ENV === 'development'
            ? error.message
            : 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'}
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details
            style={{
              marginBottom: '24px',
              textAlign: 'left',
              background: '#f9fafb',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontFamily: 'monospace',
            }}
          >
            <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
              Ver detalles técnicos
            </summary>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: '#ef4444',
              }}
            >
              {error.stack}
            </pre>
          </details>
        )}

        <button
          onClick={resetErrorBoundary}
          style={{
            padding: '12px 24px',
            background: '#0049ff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0040dd';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#0049ff';
          }}
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const handleError = (error: Error, info: { componentStack?: string | null }) => {
    // Log el error
    log.error('Error Boundary capturó un error', error, {
      componentStack: info.componentStack || 'No stack available',
    });

    // En producción, podrías enviar el error a un servicio como Sentry
    if (process.env.NODE_ENV === 'production') {
      // TODO: Enviar a servicio de monitoreo
      // Ejemplo: Sentry.captureException(error);
    }
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={fallback || ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Reset del estado si es necesario
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

// Hook para lanzar errores desde componentes
export function useErrorHandler() {
  const [, setError] = React.useState();

  return React.useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
}
