import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '')
  if (!token) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
  }

  const id = context.params.id
  if (!id) {
    return NextResponse.json({ error: 'معرف الحجز مطلوب' }, { status: 400 })
  }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user?.email) {
    return NextResponse.json({ error: 'جلسة غير صالحة' }, { status: 401 })
  }

  let body: { payment_proof_url?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح' }, { status: 400 })
  }
  const { payment_proof_url } = body
  if (typeof payment_proof_url !== 'string' || !payment_proof_url.trim()) {
    return NextResponse.json({ error: 'رابط إثبات الدفع مطلوب' }, { status: 400 })
  }

  const { data: reservationRow, error: fetchError } = await supabase
    .from('reservations')
    .select('id, email')
    .eq('id', id)
    .single()

  if (fetchError || !reservationRow) {
    return NextResponse.json({ error: 'الحجز غير موجود' }, { status: 404 })
  }
  const reservation = reservationRow as { id: string; email: string }
  if (reservation.email !== user.email) {
    return NextResponse.json({ error: 'غير مصرح بتعديل هذا الحجز' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('reservations')
    // @ts-expect-error Supabase client infers never for update with custom Database type
    .update({ payment_proof_url: payment_proof_url.trim() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data)
}
