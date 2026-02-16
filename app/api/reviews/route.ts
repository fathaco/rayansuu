import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { isAdmin } from '@/lib/auth-admin'
import type { ReviewInsert } from '@/types/database'

export async function GET() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const ok = await isAdmin(request)
  if (!ok) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  }
  try {
    const body = await request.json()
    const { content, image_url } = body
    const payload: ReviewInsert = {
      content: content ?? null,
      image_url: image_url ?? null,
    }
    const { data, error } = await supabase
      .from('reviews')
      .insert(payload)
      .select()
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
