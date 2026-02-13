import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'فتحة - منصة العلوم الشرعية الرقمية',
  description: 'منصة تعليمية رصينة ومتوازنة لتعلم العلوم الشرعية',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
