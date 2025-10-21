'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

interface OfflineDataManager<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
  retry: () => void;
  updateData: (newData: T) => void;
}

interface UseOfflineDataOptions {
  enableRetry?: boolean;
  retryDelay?: number;
  maxRetries?: number;
}

export const useOfflineData = <T>(
  fetchFunction: () => Promise<T>,
  options: UseOfflineDataOptions = {}
): OfflineDataManager<T> => {
  const {
    enableRetry = true,
    retryDelay = 5000,
    maxRetries = 3,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await fetchFunction();
      setData(result);
      setRetryCount(0);
      setIsOffline(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      setIsOffline(!navigator.onLine);
      
      if (enableRetry && retryCount < maxRetries && navigator.onLine) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchData();
        }, retryDelay);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, enableRetry, retryDelay, maxRetries, retryCount]);

  const retry = useCallback(() => {
    setRetryCount(0);
    fetchData();
  }, [fetchData]);

  const updateData = useCallback((newData: T) => {
    setData(newData);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (error && enableRetry) {
        retry();
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error, enableRetry, retry]);

  return {
    data,
    isLoading,
    error,
    isOffline,
    retry,
    updateData,
  };
};

// Hook específico para operaciones que requieren conexión
export const useOnlineOperation = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const executeWhenOnline = useCallback(async (
    operation: () => Promise<void>,
    offlineMessage?: string
  ) => {
    if (!isOnline) {
      toast.warning(offlineMessage || 'Esta operación requiere conexión a internet', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }

    try {
      await operation();
      return true;
    } catch {
      toast.error('Error en la operación', {
        position: 'top-right',
        autoClose: 3000,
      });
      return false;
    }
  }, [isOnline]);

  return {
    isOnline,
    executeWhenOnline,
  };
};
