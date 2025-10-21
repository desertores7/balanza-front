'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;

      // Registrar el service worker
      wb.register();
      
      console.log('[PWA] Workbox registrado, iniciando precache...');

      // Listener para actualizaciones
      wb.addEventListener('installed', (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.log(`[PWA] Service Worker instalado:`, event);
      });

      wb.addEventListener('controlling', (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.log(`[PWA] Service Worker controlando:`, event);
      });

      wb.addEventListener('activated', (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.log(`[PWA] Service Worker activado:`, event);
      });

      // Listener para cuando hay una nueva versión esperando
      wb.addEventListener('waiting', (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.log(`[PWA] Nueva versión disponible:`, event);
        // Puedes mostrar un mensaje al usuario aquí
      });

      // Listener para errores
      wb.addEventListener('message', (event: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          const { updatedURL } = event.data.payload;
          console.log(`[PWA] Cache actualizado para: ${updatedURL}`);
        }
      });
    } else if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator
    ) {
      // Registro manual si workbox no está disponible
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            console.log('[PWA] Service Worker registrado:', registration);
            
            // Forzar activación inmediata
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            
            // Verificar y crear caches iniciales
            caches.keys().then((cacheNames) => {
              console.log('[PWA] Caches disponibles:', cacheNames);
              
              if (cacheNames.length === 0) {
                console.log('[PWA] No hay caches, forzando precache...');
                
                // Forzar precache de recursos críticos
                const criticalResources = [
                  '/',
                  '/manifest.json',
                  '/assets/Logo.svg',
                ];
                
                caches.open('workbox-precache-v2-' + location.origin).then((cache) => {
                  cache.addAll(criticalResources).then(() => {
                    console.log('[PWA] Recursos críticos cacheados');
                  }).catch((err) => {
                    console.error('[PWA] Error al cachear recursos:', err);
                  });
                });
              }
            });
            
            // Verificar actualizaciones cada 60 segundos
            setInterval(() => {
              registration.update();
            }, 60000);
          })
          .catch((error) => {
            console.error('[PWA] Error al registrar Service Worker:', error);
          });
      });
    }
    
    // Listener para cuando el SW toma control
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] Service Worker ahora controla la página');
        
        // Verificar caches después de que el SW tome control
        setTimeout(() => {
          caches.keys().then((keys) => {
            console.log('[PWA] Caches después de control:', keys);
          });
        }, 1000);
      });
    }
  }, []);

  return null;
}

// Declaración de tipo para TypeScript
declare global {
  interface Window {
    workbox: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

