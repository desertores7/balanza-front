import type { Metadata } from 'next';

export const siteMetadata: Metadata = {
  title: {
    default: 'Balanza | Gestión de Pesaje',
    template: '%s | Sistema de Balanza'
  },
  description: 'Sistema integral de gestión de pesaje para control de clientes, vehículos, productos y operaciones de balanza.',
  keywords: ['balanza', 'pesaje', 'gestión', 'vehículos', 'productos', 'clientes'],
  authors: [{ name: 'Tu Empresa' }],
  robots: {
    index: false, // Cambiar a true en producción
    follow: false,
  },
  icons: {
    icon: '/assets/Logo-sidebar.svg',
  },
};


