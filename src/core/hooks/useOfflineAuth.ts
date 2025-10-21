import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/core/store';
import apiClient from '@/core/lib/apiClient';
import { toast } from 'react-toastify';

interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  activeUser: number;
  role: string;
  companyUuid: string;
  imgProfile?: {
    url: string;
  };
  offline?: boolean; // Propiedad opcional para usuarios offline
}

interface OfflineCredentials {
  email: string;
  password: string;
  encrypted: boolean;
  timestamp: number;
  expiresAt: number;
}

interface OfflineAuthResult {
  success: boolean;
  user?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  token?: string;
  refreshToken?: string;
  isOffline: boolean;
}

// Función simple de encriptación (en producción usar una librería más robusta)
const encrypt = (text: string): string => {
  return btoa(text); // Base64 encoding (no es seguro, solo para demo)
};

const decrypt = (encryptedText: string): string => {
  return atob(encryptedText); // Base64 decoding
};

// Función para validar token offline (simulada)
const validateTokenOffline = (token: string): boolean => {
  try {
    // Decodificar JWT básico (sin verificar firma)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    
    // Verificar si el token no ha expirado
    return payload.exp > now;
  } catch {
    return false;
  }
};

export const useOfflineAuth = () => {
  const { token, user, setAuth } = useAuthStore();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlineCredentials, setOfflineCredentials] = useState<OfflineCredentials | null>(null);

  // Detectar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cargar credenciales offline guardadas
  useEffect(() => {
    const savedCredentials = localStorage.getItem('offline_credentials');
    if (savedCredentials) {
      try {
        const credentials = JSON.parse(savedCredentials);
        // Verificar si las credenciales no han expirado
        if (credentials.expiresAt > Date.now()) {
          setOfflineCredentials(credentials);
        } else {
          localStorage.removeItem('offline_credentials');
        }
      } catch (error) {
        console.error('Error al cargar credenciales offline:', error);
        localStorage.removeItem('offline_credentials');
      }
    }
  }, []);

  // Función para guardar credenciales offline
  const saveOfflineCredentials = useCallback((email: string, password: string) => {
    const credentials: OfflineCredentials = {
      email: encrypt(email),
      password: encrypt(password),
      encrypted: true,
      timestamp: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 días
    };

    localStorage.setItem('offline_credentials', JSON.stringify(credentials));
    setOfflineCredentials(credentials);
    
    toast.info('Credenciales guardadas para uso offline', {
      autoClose: 3000,
    });
  }, []);

  // Función para limpiar credenciales offline
  const clearOfflineCredentials = useCallback(() => {
    localStorage.removeItem('offline_credentials');
    setOfflineCredentials(null);
  }, []);

  // Función principal de login (online/offline)
  const login = useCallback(async (
    email: string, 
    password: string, 
    rememberMe: boolean = false
  ): Promise<OfflineAuthResult> => {
    
    // Si estamos online, intentar login normal
    if (!isOffline) {
      try {
        const response = await apiClient.post('/auth/login', {
          email,
          password,
        });

        const { access_token, refresh_token, user: userData } = response.data;

        if (access_token && refresh_token && userData) {
          // Guardar en el store
          setAuth(access_token, refresh_token, userData, rememberMe);
          
          // Si el usuario quiere recordar, guardar credenciales para offline
          if (rememberMe) {
            saveOfflineCredentials(email, password);
          }

          return {
            success: true,
            user: userData,
            token: access_token,
            refreshToken: refresh_token,
            isOffline: false,
          };
        }
      } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error('Error en login online:', error);
        
        // Si falla por red, intentar login offline
        if (!error.response) {
          return await loginOffline(email, password);
        }
        
        throw error;
      }
    }

    // Si estamos offline, usar credenciales guardadas
    return await loginOffline(email, password);
  }, [isOffline, setAuth, saveOfflineCredentials]);

  // Función de login offline
  const loginOffline = useCallback(async (
    email: string, 
    password: string
  ): Promise<OfflineAuthResult> => {
    
    // Verificar si tenemos credenciales guardadas
    if (!offlineCredentials) {
      throw new Error('No hay credenciales guardadas para uso offline');
    }

    // Verificar si las credenciales coinciden
    const savedEmail = decrypt(offlineCredentials.email);
    const savedPassword = decrypt(offlineCredentials.password);

    if (savedEmail !== email || savedPassword !== password) {
      throw new Error('Credenciales incorrectas para modo offline');
    }

    // Verificar si tenemos un token válido guardado
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken && validateTokenOffline(savedToken)) {
      const savedUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const savedRefreshToken = localStorage.getItem('refresh_token') || '';

      // Restaurar sesión offline
      setAuth(savedToken, savedRefreshToken, savedUser, true);

      return {
        success: true,
        user: savedUser,
        token: savedToken,
        refreshToken: savedRefreshToken,
        isOffline: true,
      };
    }

    // Si no hay token válido, crear una sesión offline temporal
    const offlineUser: User = {
      uuid: 'offline_user',
      firstName: 'Usuario',
      lastName: 'Offline',
      email: email,
      activeUser: 1,
      role: 'user',
      companyUuid: 'offline_company',
      offline: true,
    };

    const offlineToken = btoa(JSON.stringify({
      sub: 'offline_user',
      email: email,
      iat: Date.now() / 1000,
      exp: (Date.now() / 1000) + (24 * 60 * 60), // 24 horas
      offline: true,
    }));

    // Guardar sesión offline
    setAuth(offlineToken, 'offline_refresh', offlineUser, true);

    toast.warning('Modo offline activado. Funcionalidad limitada.', {
      autoClose: 5000,
    });

    return {
      success: true,
      user: offlineUser,
      token: offlineToken,
      refreshToken: 'offline_refresh',
      isOffline: true,
    };
  }, [offlineCredentials, setAuth]);

  // Función para verificar si el usuario puede usar funciones offline
  const canUseOffline = useCallback(() => {
    return offlineCredentials !== null && offlineCredentials.expiresAt > Date.now();
  }, [offlineCredentials]);

  // Función para sincronizar cuando vuelva la conexión
  const syncWhenOnline = useCallback(async () => {
    if (!isOffline && (user as any)?.offline) { // eslint-disable-line @typescript-eslint/no-explicit-any
      try {
        // Intentar re-autenticación online
        if (offlineCredentials) {
          const email = decrypt(offlineCredentials.email);
          const password = decrypt(offlineCredentials.password);
          
          const result = await login(email, password, true);
          
          if (result.success && !result.isOffline) {
            toast.success('Sesión sincronizada con el servidor', {
              autoClose: 3000,
            });
          }
        }
      } catch (error) {
        console.error('Error al sincronizar sesión:', error);
        toast.error('Error al sincronizar sesión', {
          autoClose: 3000,
        });
      }
    }
  }, [isOffline, user, offlineCredentials, login]);

  // Sincronizar automáticamente cuando vuelva la conexión
  useEffect(() => {
    if (!isOffline) {
      syncWhenOnline();
    }
  }, [isOffline, syncWhenOnline]);

  return {
    login,
    isOffline,
    canUseOffline: canUseOffline(),
    offlineCredentials: offlineCredentials !== null,
    clearOfflineCredentials,
    syncWhenOnline,
  };
};
