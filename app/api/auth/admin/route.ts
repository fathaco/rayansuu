import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const INGEST = 'http://127.0.0.1:7244/ingest/115e6265-d769-46f7-a0ac-a3b21fa1d1cf'
const log = (location: string, message: string, data: Record<string, unknown>) => {
  fetch(INGEST, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location, message, data, timestamp: Date.now(), hypothesisId: 'H1' }) }).catch(() => {})
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '')
  if (!token) {
    // #region agent log
    log('api/auth/admin:no-token', 'No token in request', { hasToken: false })
    // #endregion
    return NextResponse.json({ isAdmin: false }, { status: 200 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user?.email) {
    // #region agent log
    log('api/auth/admin:getUser-fail', 'getUser failed or no email', { hasToken: true, getUserError: !!error, hasEmail: !!user?.email })
    // #endregion
    return NextResponse.json({ isAdmin: false }, { status: 200 })
  }

  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  const isAdmin = adminEmails.includes(user.email.toLowerCase())
  // #region agent log
  log('api/auth/admin:result', 'Admin check result', { adminEmailsCount: adminEmails.length, isAdmin })
  // #endregion
  return NextResponse.json({ isAdmin })
}
