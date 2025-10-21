import 'bootstrap/dist/css/bootstrap.min.css';
import { Public_Sans, Russo_One } from "next/font/google";
import "@styles/globals.scss";
import '@styles/pages/Home.module.scss'
import 'react-toastify/dist/ReactToastify.css';
import ToastProvider from '@/core/components/ToastProvider';
import { siteMetadata } from '@/core/config/metadata';
import PWARegister from '@/core/components/PWARegister';

const PublicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--primary-font"
});

const RussoOne = Russo_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--secondary-font"
});

export const metadata = {
  ...siteMetadata,
  manifest: '/manifest.json',
  themeColor: '#007bff',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Balanza Frontend'
  },
  icons: {
    icon: '/assets/Logo.svg',
    apple: '/assets/Logo.svg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <head>
        <link rel="manifest" href="/manifest" />
        <meta name="theme-color" content="#007bff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Balanza Frontend" />
        <link rel="apple-touch-icon" href="/assets/Logo.svg" />
      </head>
      <body
        className={`${PublicSans.variable} ${RussoOne.variable} antialiased`}
      >
        <PWARegister />
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
