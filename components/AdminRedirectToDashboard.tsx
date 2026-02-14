'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

/**
 * When admin is on home or events, redirect to dashboard so they land there after login.
 */
export default function AdminRedirectToDashboard() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, session, loading } = useAuth()

  useEffect(() => {
    if (loading || !user || !session?.access_token) return
    if (pathname !== '/' && pathname !== '/events') return

    fetch('/api/auth/admin', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => r.json())
      .then((data: { isAdmin?: boolean }) => {
        if (data.isAdmin === true) router.replace('/dashboard')
      })
      .catch(() => {})
  }, [pathname, user, session?.access_token, loading, router])

  return null
}
