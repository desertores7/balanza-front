import React from 'react';
import { Alert, Badge } from 'react-bootstrap';
import { useOfflineAuth } from '@/core/hooks/useOfflineAuth';

interface SyncStatusProps {
  className?: string;
  style?: React.CSSProperties;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ className = '', style }) => {
  const { isOffline, canUseOffline, offlineCredentials } = useOfflineAuth();

  if (!isOffline && !offlineCredentials) {
    return null; // No mostrar nada si está online y no hay credenciales offline
  }

  return (
    <div className={`sync-status ${className}`} style={style}>
      {isOffline ? (
        <Alert variant="warning" className="mb-2 p-2">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <strong>🔌 Modo Offline</strong>
              <br />
              <small>Funcionalidad limitada. Los datos se sincronizarán cuando vuelva la conexión.</small>
            </div>
            <Badge bg="warning" className="ms-2">
              OFFLINE
            </Badge>
          </div>
        </Alert>
      ) : (
        <Alert variant="success" className="mb-2 p-2">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <strong>🌐 Conectado</strong>
              <br />
              <small>Todas las funciones disponibles.</small>
            </div>
            <Badge bg="success" className="ms-2">
              ONLINE
            </Badge>
          </div>
        </Alert>
      )}
      
      {canUseOffline && (
        <Alert variant="info" className="mb-2 p-2">
          <div className="d-flex align-items-center">
            <div>
              <strong>💾 Credenciales Offline</strong>
              <br />
              <small>Puedes hacer login sin conexión.</small>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default SyncStatus;