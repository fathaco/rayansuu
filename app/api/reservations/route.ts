import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { event_id, name, email, phone } = body
    if (!event_id || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'event_id, name, email, phone مطلوبة' },
        { status: 400 }
      )
    }

    const emailNorm = email.trim().toLowerCase()
    // One reservation per email per event
    const { data: existing } = await supabase
      .from('reservations')
      .select('id')
      .eq('event_id', event_id)
      .ilike('email', emailNorm)
      .limit(1)
      .maybeSingle()
    if (existing) {
      return NextResponse.json(
        { error: 'أنت مسجّل مسبقاً في هذه الفعالية. لا يمكن التسجيل أكثر من مرة.' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('reservations')
      // @ts-expect-error Supabase client infers never for insert with custom Database type
      .insert({ event_id, name, email: emailNorm, phone, status: 'pending' })
      .select()
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
