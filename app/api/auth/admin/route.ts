import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// In production (e.g. Vercel): set env ADMIN_EMAILS to comma-separated admin emails (e.g. admin@gmail.com) so dashboard and "لوحة الإدارة" in menu work.
export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '')
  if (!token) {
    return NextResponse.json({ isAdmin: false }, { status: 200 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user?.email) {
    return NextResponse.json({ isAdmin: false }, { status: 200 })
  }

  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  const isAdmin = adminEmails.includes(user.email.toLowerCase())
  return NextResponse.json({ isAdmin })
}
