import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { isAdmin } from '@/lib/auth-admin'
import type { FaqInsert } from '@/types/database'

export async function GET() {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })
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
    const { question, answer, display_order } = body
    if (!question || !answer) {
      return NextResponse.json({ error: 'question و answer مطلوبان' }, { status: 400 })
    }
    const payload: FaqInsert = {
      question,
      answer,
      display_order: display_order ?? 0,
    }
    const { data, error } = await supabase
      .from('faqs')
      // @ts-expect-error Supabase client infers never for insert with custom Database type
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
