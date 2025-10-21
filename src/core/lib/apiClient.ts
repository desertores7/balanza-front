import axios from "axios";
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  withCredentials: true,
  timeout: 10000, // 10 segundos de timeout
});

// ✅ Cache del token para evitar lecturas repetidas
let cachedToken: string | null = null;
let lastCheck = 0;
const CACHE_DURATION = 5000; // 5 segundos

// Queue para operaciones offline
const offlineQueue: Array<{
  config: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  resolve: (value: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}> = [];

// Función para procesar la cola offline cuando se recupere la conexión
const processOfflineQueue = async () => {
  if (offlineQueue.length === 0) {
    console.log('✅ [QUEUE] No hay operaciones pendientes en cola offline');
    return;
  }
  
  console.log(`🔄 [QUEUE] Procesando ${offlineQueue.length} operaciones en cola offline`);
  console.table(offlineQueue.map((item, index) => ({
    index,
    url: item.config?.url,
    method: item.config?.method?.toUpperCase(),
    critical: item.config?.critical || false
  })));
  
  const queueCopy = [...offlineQueue];
  offlineQueue.length = 0; // Limpiar la cola
  
  for (const { config, resolve, reject } of queueCopy) {
    try {
      console.log(`📤 [QUEUE] Procesando request: ${config.method?.toUpperCase()} ${config.url}`);
      const response = await apiClient(config);
      console.log(`✅ [QUEUE] Request procesado exitosamente: ${config.url}`);
      resolve(response);
    } catch (error) {
      console.error(`❌ [QUEUE] Error procesando request ${config.url}:`, error);
      reject(error);
    }
  }
  
  console.log('🎉 [QUEUE] Cola offline procesada completamente');
};

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use((config) => {
  const now = Date.now();
  
  // ✅ Solo leer localStorage si el cache expiró
  if (!cachedToken || now - lastCheck > CACHE_DURATION) {
    // Orden de prioridad: Zustand store > cookies > localStorage
    if (typeof window !== 'undefined') {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          cachedToken = parsed.state?.token || null;
        }
      } catch (error) {
        console.warn('Error al obtener token del store:', error);
      }
    }
    
    if (!cachedToken) {
      cachedToken = Cookies.get('token') || localStorage.getItem("token") || null;
    }
    
    lastCheck = now;
  }

  if (cachedToken) {
    config.headers.Authorization = `Bearer ${cachedToken}`;
  }
  
  return config;
});

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    console.log('🌐 [API] Request exitoso:', {
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      status: response.status
    });
    return response;
  },
  (error) => {
    // Manejar errores de red (offline)
    if (!error.response && (error.code === 'NETWORK_ERROR' || error.message === 'Network Error')) {
      console.warn('📴 [API] Error de red detectado, agregando a cola offline:', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        error: error.message
      });
      
      // Agregar a la cola offline si no es una operación crítica
      if (!error.config?.critical) {
        console.log('📝 [API] Agregando request a cola offline');
        return new Promise((resolve, reject) => {
          offlineQueue.push({
            config: error.config,
            resolve,
            reject,
          });
        });
      } else {
        console.log('⚠️ [API] Request crítico, no se agrega a cola offline');
      }
    }
    
    if (error.response?.status === 401) {
      // Token expirado o inválido
      console.warn('Token expirado, limpiando autenticación');
      
      // ✅ Limpiar cache del token
      cachedToken = null;
      lastCheck = 0;
      
      // Limpiar tokens de localStorage y cookies
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      Cookies.remove('token');
      Cookies.remove('refresh_token');
      Cookies.remove('user');
      
    }
    
    return Promise.reject(error);
  }
);

// ✅ Función para limpiar el cache del token (útil al hacer login/logout)
export const clearTokenCache = () => {
  cachedToken = null;
  lastCheck = 0;
};

// Función para hacer requests con manejo offline mejorado
export const makeOfflineRequest = async (config: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    return await apiClient(config);
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    // Si es un error de red y no es crítica, agregar a la cola
    if (!error.response && !config.critical) {
      return new Promise((resolve, reject) => {
        offlineQueue.push({
          config,
          resolve,
          reject,
        });
      });
    }
    throw error;
  }
};

// Función para obtener el estado de la cola offline
export const getOfflineQueueStatus = () => ({
  queueLength: offlineQueue.length,
  isOnline: navigator.onLine,
});

// Escuchar eventos de conexión para procesar la cola
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('🌐 [NETWORK] Conexión restablecida, procesando cola offline');
    processOfflineQueue();
  });
  
  window.addEventListener('offline', () => {
    console.log('📴 [NETWORK] Conexión perdida, trabajando en modo offline');
  });
}

export default apiClient;
