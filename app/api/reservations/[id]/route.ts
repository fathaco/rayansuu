import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id
    if (!id) {
      return NextResponse.json({ error: 'Missing reservation id' }, { status: 400 })
    }
    let body: { status?: string } = {}
    try {
      body = await request.json()
    } catch {
      // invalid or empty JSON
    }
    const { status } = body
    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'status must be pending, confirmed, or cancelled' },
        { status: 400 }
      )
    }
    const { data, error } = await supabaseAdmin
      .from('reservations')
      // @ts-expect-error Supabase client infers never for update with custom Database type
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error('[PATCH /api/reservations/[id]]', err)
    const message = err instanceof Error ? err.message : 'خطأ في الخادم'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
