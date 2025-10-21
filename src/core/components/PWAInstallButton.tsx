'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      toast.success('¡Aplicación instalada correctamente!', {
        position: 'top-right',
        autoClose: 3000,
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verificar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast.success('Instalando aplicación...', {
          position: 'top-right',
          autoClose: 2000,
        });
      } else {
        toast.info('Instalación cancelada', {
          position: 'top-right',
          autoClose: 2000,
        });
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch {
      toast.error('Error al instalar la aplicación', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return {
    isInstallable,
    isInstalled,
    installApp,
  };
};

interface PWAInstallButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '', 
  children 
}) => {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

  if (!isInstallable || isInstalled) return null;

  return (
    <button
      onClick={installApp}
      className={`btn btn-primary ${className}`}
      title="Instalar aplicación"
    >
      {children || (
        <>
          <i className="bi bi-download me-2"></i>
          Instalar App
        </>
      )}
    </button>
  );
};

export default PWAInstallButton;
