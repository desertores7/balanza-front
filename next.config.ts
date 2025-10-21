import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  // 🚀 Optimizaciones de build
  productionBrowserSourceMaps: false, // Desactivar sourcemaps en producción (mejora velocidad)
  compress: true, // Comprimir respuestas
  poweredByHeader: false, // Remover header X-Powered-By
  
  // 📦 Optimización de compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // 🖼️ Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rlujmuudmcsaujtwdmkz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    formats: ['image/avif', 'image/webp'], // Formatos modernos optimizados
  },
  
  // 🔄 Rewrites para PWA
  async rewrites() {
    return [
      {
        source: '/manifest.json',
        destination: '/api/manifest',
      },
    ];
  },
  
  // 📋 Headers optimizados
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/workbox-:hash.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false, // ✅ Habilitado en desarrollo y producción para testing
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    // 📄 Páginas HTML (Next.js)
    {
      urlPattern: new RegExp(`^${process.env.NEXT_PUBLIC_SITE_URL || 'https://balanza-front.vercel.app'}/.*$`, 'i'),      
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 1 día
        },
      },
    },
    {
      urlPattern: ({ url }) => {
        // Cachear todas las páginas (excepto API y archivos estáticos)
        return url.origin === self.location.origin && 
               !url.pathname.startsWith('/api') &&
               !url.pathname.startsWith('/_next/static') &&
               !url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2)$/);
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-html',
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24, // 1 día
        },
      },
    },
    // 🖼️ Imágenes
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
        },
      },
    },
    // 📦 Recursos estáticos (JS, CSS, Fonts)
    {
      urlPattern: /\.(?:js|css|woff|woff2|ttf|eot)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
        },
      },
    },
    // 🔌 API externo (Backend)
    {
      urlPattern: /^https:\/\/balanza-backend\.vercel\.app\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-backend',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5, // 5 minutos
        },
      },
    },
    // 🗄️ Supabase
    {
      urlPattern: /^https:\/\/rlujmuudmcsaujtwdmkz\.supabase\.co\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'supabase-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
        },
      },
    },
    // 🌐 API local
    {
      urlPattern: /^\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-local',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5, // 5 minutos
        },
      },
    },
  ],
});

export default pwaConfig(nextConfig);
