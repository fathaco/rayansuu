import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('event_id')
  let query = supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false })
  if (eventId) {
    query = query.eq('event_id', eventId)
  }
  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data)
}
