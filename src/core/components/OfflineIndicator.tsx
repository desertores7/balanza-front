'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface NetworkStatus {
  isOnline: boolean;
  isReconnecting: boolean;
}

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isReconnecting: false,
  });

  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: true,
        isReconnecting: false,
      }));
      toast.success('Conexión restablecida', {
        position: 'top-right',
        autoClose: 3000,
      });
    };

    const handleOffline = () => {
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: false,
        isReconnecting: true,
      }));
      toast.warning('Sin conexión a internet. Trabajando en modo offline', {
        position: 'top-right',
        autoClose: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return networkStatus;
};

interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
  const { isOnline, isReconnecting } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className={`alert alert-warning d-flex align-items-center ${className}`} role="alert">
      <div className="d-flex align-items-center">
        <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
        <div>
          <strong>Modo Offline</strong>
          <div className="small">
            {isReconnecting ? 'Reconectando...' : 'Sin conexión a internet'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;
