import type { Metadata, Viewport } from 'next';
import './globals.css';

// ============================================================
// Fan Pulse — Root Layout
// ============================================================

export const metadata: Metadata = {
  title: 'Fan Pulse · World Cup 2026',
  description: 'Tu plataforma de predicciones, check-ins y gamificación para el Mundial FIFA 2026. Compite con fans de todo el mundo.',
  keywords: ['World Cup 2026', 'FIFA', 'predicciones', 'polla', 'Mundial', 'fútbol'],
  authors: [{ name: 'Fan Pulse' }],
  openGraph: {
    title: 'Fan Pulse · World Cup 2026',
    description: 'Predice, haz check-in y compite en el Mundial 2026',
    type: 'website',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fan Pulse',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#08080F',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-theme="usa" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        {/* Theme flash overlay */}
        <div id="theme-flash" aria-hidden="true" />

        {/* Animated background gradient mesh */}
        <div className="bg-mesh" aria-hidden="true" />

        {/* App shell */}
        <div id="app">
          {children}
        </div>

        {/* Toast container */}
        <div id="toast" role="status" aria-live="polite" />
      </body>
    </html>
  );
}
