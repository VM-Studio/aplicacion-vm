'use client';

import { Toaster as Sonner, toast as sonnerToast } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        style: {
          background: '#fff',
          color: '#111',
          border: '1px solid #e5e5e5',
          fontFamily: 'Inter, sans-serif',
        },
        className: 'sonner-toast',
        duration: 4000,
      }}
      richColors
    />
  );
}

// Helper functions para consistencia
export const toast = {
  success: (message: string) => {
    sonnerToast.success(message);
  },
  error: (message: string) => {
    sonnerToast.error(message);
  },
  info: (message: string) => {
    sonnerToast.info(message);
  },
  warning: (message: string) => {
    sonnerToast.warning(message);
  },
  loading: (message: string) => {
    return sonnerToast.loading(message);
  },
  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};
