import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { AuthProvider } from '@/context/auth-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Berçário — Impulsando mayoristas del Norte de Santander',
  description:
    'Berçário da visibilidad y crecimiento a mayoristas y emprendedores del Norte de Santander, Colombia.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5f3ef',
}

export default function RootLayout({
  children,
  ...rest
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className="bg-background"
    >
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
