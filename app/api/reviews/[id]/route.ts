import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { isAdmin } from '@/lib/auth-admin'
import type { ReviewUpdate } from '@/types/database'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: RouteContext) {
  const ok = await isAdmin(request)
  if (!ok) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  }
  try {
    const { id } = await context.params
    if (!id) {
      return NextResponse.json({ error: 'معرف المراجعة مطلوب' }, { status: 400 })
    }
    const body = await request.json()
    const { content, image_url } = body
    const payload: ReviewUpdate = {}
    if (content !== undefined) payload.content = content ?? null
    if (image_url !== undefined) payload.image_url = image_url ?? null
    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: 'لا توجد حقول للتحديث' }, { status: 400 })
    }
    const { data, error } = await supabase
      .from('reviews')
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
    console.error('[PATCH /api/reviews/[id]]', err)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const ok = await isAdmin(_request)
  if (!ok) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  }
  try {
    const { id } = await context.params
    if (!id) {
      return NextResponse.json({ error: 'معرف المراجعة مطلوب' }, { status: 400 })
    }
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/reviews/[id]]', err)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
