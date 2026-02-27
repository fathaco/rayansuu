import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import AdminRedirectToDashboard from '@/components/AdminRedirectToDashboard'
import SplashWrapper from '@/components/SplashWrapper'
import VideoNotificationModal from '@/components/VideoNotificationModal'

export const metadata: Metadata = {
  title: 'فتحة - منصة العلوم الشرعية الرقمية',
  description: 'منصة تعليمية رصينة ومتوازنة لتعلم العلوم الشرعية',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          <SplashWrapper>
            <AdminRedirectToDashboard />
            <VideoNotificationModal />
            {children}
          </SplashWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
