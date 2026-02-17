import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { isAdmin } from '@/lib/auth-admin'
import type { FaqUpdate } from '@/types/database'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: RouteContext) {
  const ok = await isAdmin(request)
  if (!ok) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  }
  try {
    const { id } = await context.params
    if (!id) {
      return NextResponse.json({ error: 'معرف السؤال مطلوب' }, { status: 400 })
    }
    const body = await request.json()
    const { question, answer, display_order } = body
    const payload: FaqUpdate = {}
    if (question !== undefined) payload.question = question
    if (answer !== undefined) payload.answer = answer
    if (display_order !== undefined) payload.display_order = display_order
    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: 'لا توجد حقول للتحديث' }, { status: 400 })
    }
    const { data, error } = await supabase
      .from('faqs')
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
    console.error('[PATCH /api/faqs/[id]]', err)
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
      return NextResponse.json({ error: 'معرف السؤال مطلوب' }, { status: 400 })
    }
    const { error } = await supabase.from('faqs').delete().eq('id', id)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/faqs/[id]]', err)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
