import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  // Optimizaciones de rendimiento
  reactStrictMode: true,
  
  // Optimizar compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // Optimizar imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: false,
  },
  
  // Headers de seguridad y CORS
  async headers() {
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? [
          'https://aplicacion-vm.vercel.app',
          'https://vm-studio.vercel.app',
          // Agregar aquí tus dominios de producción
        ]
      : ['http://localhost:3000', 'http://127.0.0.1:3000'];

    return [
      {
        source: '/api/v1/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: allowedOrigins.join(','),
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, API-Version',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400', // 24 horas
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default withPWA(nextConfig);
