import type { NextConfig } from "next";

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
};

export default nextConfig;
