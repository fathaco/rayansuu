import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import type { EventUpdate } from '@/types/database'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    if (!id) {
      return NextResponse.json({ error: 'معرف الفعالية مطلوب' }, { status: 400 })
    }
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET /api/events/[id]]', err)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    if (!id) {
      return NextResponse.json({ error: 'معرف الفعالية مطلوب' }, { status: 400 })
    }
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
      price,
      tutorial_link,
    } = body
    const payload: EventUpdate = {}
    if (title !== undefined) payload.title = title
    if (description !== undefined) payload.description = description
    if (category !== undefined) payload.category = category
    if (hours !== undefined) payload.hours = hours
    if (lessons !== undefined) payload.lessons = lessons
    if (badge !== undefined) payload.badge = badge ?? null
    if (badge_color !== undefined) payload.badge_color = badge_color ?? null
    if (image_url !== undefined) payload.image_url = image_url ?? null
    if (is_new !== undefined) payload.is_new = is_new
    if (price !== undefined) payload.price = price ?? null
    if (tutorial_link !== undefined) payload.tutorial_link = tutorial_link ?? null
    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: 'لا توجد حقول للتحديث' }, { status: 400 })
    }
    const { data, error } = await supabase
      .from('events')
      // @ts-expect-error Supabase client infers never for update with custom Database type
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error('[PATCH /api/events/[id]]', err)
    const message = err instanceof Error ? err.message : 'خطأ في الخادم'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    if (!id) {
      return NextResponse.json({ error: 'معرف الفعالية مطلوب' }, { status: 400 })
    }
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/events/[id]]', err)
    const message = err instanceof Error ? err.message : 'خطأ في الخادم'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
