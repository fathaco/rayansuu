import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

export async function GET() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      category,
      hours,
      lessons,
      badge,
      badge_color,
      image_url,
      is_new,
    } = body
    if (!title || !description || !category || !hours || !lessons) {
      return NextResponse.json(
        { error: 'title, description, category, hours, lessons مطلوبة' },
        { status: 400 }
      )
    }
    const { data, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        category,
        hours,
        lessons,
        badge: badge ?? null,
        badge_color: badge_color ?? null,
        image_url: image_url ?? null,
        is_new: is_new ?? true,
      })
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
