'use client';

import { useEffect } from 'react';

// Función global para monitorear estado offline desde consola
declare global {
  interface Window {
    offlineMonitor: {
      getStatus: () => void;
      getOfflineForms: () => void;
      getOfflineData: () => void;
      clearOfflineData: () => void;
    };
  }
}

export const OfflineMonitor = () => {
  useEffect(() => {
    // Función para obtener estado general
    const getStatus = () => {
      const offlineForms = JSON.parse(localStorage.getItem('offlineForms') || '[]');
      const status = {
        isOnline: navigator.onLine,
        offlineFormsCount: offlineForms.length,
        offlineForms: offlineForms.map((form: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
          id: form.id,
          route: form.route,
          method: form.method,
          timestamp: new Date(form.timestamp).toLocaleString(),
          tableKey: form.tableKey
        })),
        localStorageKeys: Object.keys(localStorage).filter(key => 
          key.startsWith('offline_') || key.startsWith('cache_')
        ),
        timestamp: new Date().toLocaleString()
      };
      
      console.log('📊 [MONITOR] Estado actual del sistema offline:', status);
      console.table(status.offlineForms);
      return status;
    };

    // Función para obtener solo formularios offline
    const getOfflineForms = () => {
      const offlineForms = JSON.parse(localStorage.getItem('offlineForms') || '[]');
      console.log(`📝 [MONITOR] Formularios offline (${offlineForms.length}):`, offlineForms);
      return offlineForms;
    };

    // Función para obtener datos offline de tablas
    const getOfflineData = () => {
      const offlineKeys = Object.keys(localStorage).filter(key => key.startsWith('offline_'));
      const offlineData: Record<string, any> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
      
      offlineKeys.forEach(key => {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        offlineData[key] = data;
      });
      
      console.log('💾 [MONITOR] Datos offline de tablas:', offlineData);
      return offlineData;
    };

    // Función para limpiar datos offline
    const clearOfflineData = () => {
      localStorage.removeItem('offlineForms');
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('offline_')) {
          localStorage.removeItem(key);
        }
      });
      console.log('🧹 [MONITOR] Datos offline limpiados');
    };

    // Exponer funciones globalmente
    window.offlineMonitor = {
      getStatus,
      getOfflineForms,
      getOfflineData,
      clearOfflineData
    };

    // Mostrar instrucciones en consola
    console.log(`
🔍 [MONITOR] Herramientas de monitoreo offline disponibles:

📊 offlineMonitor.getStatus()     - Estado completo del sistema
📝 offlineMonitor.getOfflineForms() - Solo formularios pendientes  
💾 offlineMonitor.getOfflineData()  - Datos offline de tablas
🧹 offlineMonitor.clearOfflineData() - Limpiar datos offline

Ejemplo: offlineMonitor.getStatus()
    `);

    return () => {
      // Limpiar funciones globales al desmontar
      if (window.offlineMonitor) {
        delete (window as any).offlineMonitor; // eslint-disable-line @typescript-eslint/no-explicit-any
      }
    };
  }, []);

  return null; // Este componente no renderiza nada
};

export default OfflineMonitor;
