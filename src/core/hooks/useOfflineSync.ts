'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';
import apiClient from '@/core/lib/apiClient';

interface OfflineFormData {
  id: string;
  formData: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  route: string;
  method: 'post' | 'put';
  headers: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  timestamp: number;
  tableKey?: string;
}

export const useOfflineSync = () => {
  useEffect(() => {
    const syncOfflineData = async () => {
      if (!navigator.onLine) {
        console.log('🔄 [OFFLINE SYNC] Sin conexión, saltando sincronización');
        return;
      }

      const offlineForms = JSON.parse(localStorage.getItem('offlineForms') || '[]');
      
      if (offlineForms.length === 0) {
        console.log('✅ [OFFLINE SYNC] No hay formularios pendientes de sincronizar');
        return;
      }

      console.log(`🔄 [OFFLINE SYNC] Iniciando sincronización de ${offlineForms.length} formularios offline...`);
      console.table(offlineForms.map((form: OfflineFormData) => ({
        id: form.id,
        route: form.route,
        method: form.method,
        timestamp: new Date(form.timestamp).toLocaleString(),
        tableKey: form.tableKey
      })));

      const syncPromises = offlineForms.map(async (offlineData: OfflineFormData) => {
        try {
          console.log(`📤 [OFFLINE SYNC] Enviando formulario ${offlineData.id} a ${offlineData.route}`);
          
          const response = await apiClient[offlineData.method](
            offlineData.route, 
            offlineData.formData, 
            { headers: offlineData.headers }
          );

          console.log(`✅ [OFFLINE SYNC] Formulario ${offlineData.id} sincronizado exitosamente`, response.data);
          return { success: true, id: offlineData.id, response };
        } catch (error) {
          console.error(`❌ [OFFLINE SYNC] Error sincronizando formulario ${offlineData.id}:`, error);
          return { success: false, id: offlineData.id, error };
        }
      });

      const results = await Promise.all(syncPromises);
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      console.log(`📊 [OFFLINE SYNC] Resultados de sincronización:`, {
        exitosos: successful.length,
        fallidos: failed.length,
        total: results.length
      });

      // Remover formularios sincronizados exitosamente
      const remainingForms = offlineForms.filter((form: OfflineFormData) => // eslint-disable-line @typescript-eslint/no-explicit-any
        !successful.some(s => s.id === form.id)
      );
      
      localStorage.setItem('offlineForms', JSON.stringify(remainingForms));
      console.log(`🗑️ [OFFLINE SYNC] Formularios restantes en cola: ${remainingForms.length}`);

      // Limpiar datos offline de las tablas sincronizadas
      successful.forEach(({ id }) => {
        const formData = offlineForms.find((f: OfflineFormData) => f.id === id);
        if (formData?.tableKey) {
          const offlineTableData = JSON.parse(localStorage.getItem(`offline_${formData.tableKey}`) || '[]');
          const updatedData = offlineTableData.filter((item: any) => item.id !== id); // eslint-disable-line @typescript-eslint/no-explicit-any
          localStorage.setItem(`offline_${formData.tableKey}`, JSON.stringify(updatedData));
          console.log(`🧹 [OFFLINE SYNC] Limpiando datos offline de tabla ${formData.tableKey}`);
        }
      });

      if (successful.length > 0) {
        console.log(`🎉 [OFFLINE SYNC] ${successful.length} formularios sincronizados correctamente`);
        toast.success(`${successful.length} formularios sincronizados correctamente`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }

      if (failed.length > 0) {
        console.warn(`⚠️ [OFFLINE SYNC] ${failed.length} formularios no pudieron sincronizarse`);
        toast.warning(`${failed.length} formularios no pudieron sincronizarse`, {
          position: 'top-right',
          autoClose: 5000,
        });
      }
    };

    const handleOnline = () => {
      console.log('🌐 [NETWORK] Conexión restablecida, iniciando sincronización...');
      setTimeout(syncOfflineData, 1000); // Esperar un poco para estabilizar la conexión
    };

    const handleOffline = () => {
      console.log('📴 [NETWORK] Conexión perdida, trabajando en modo offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Sincronizar inmediatamente si ya hay conexión
    if (navigator.onLine) {
      console.log('🌐 [NETWORK] Aplicación iniciada con conexión disponible');
      syncOfflineData();
    } else {
      console.log('📴 [NETWORK] Aplicación iniciada sin conexión');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    getOfflineFormsCount: () => {
      const offlineForms = JSON.parse(localStorage.getItem('offlineForms') || '[]');
      return offlineForms.length;
    },
    clearOfflineData: () => {
      localStorage.removeItem('offlineForms');
      // Limpiar también datos offline de tablas
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('offline_')) {
          localStorage.removeItem(key);
        }
      });
    }
  };
};

export default useOfflineSync;
