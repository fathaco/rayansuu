import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await (await _request.json()).catch(() => ({}))
    const { status } = body
    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'status must be pending, confirmed, or cancelled' },
        { status: 400 }
      )
    }
    const { data, error } = await supabase
      .from('reservations')
      // @ts-expect-error Supabase client infers never for update with custom Database type
      .update({ status })
      .eq('id', params.id)
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
