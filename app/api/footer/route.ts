import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'
import { isAdmin } from '@/lib/auth-admin'
import type { FooterSettingsUpdate } from '@/types/database'

// Force dynamic rendering - prevent Next.js from caching this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const { data, error } = await supabase
    .from('footer_settings')
    .select('*')
    .eq('id', 1)
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  // Prevent caching - ensure fresh data is always returned
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })
}

export async function PATCH(request: Request) {
  const ok = await isAdmin(request)
  if (!ok) {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
  }
  try {
    const body = await request.json()
    const payload: FooterSettingsUpdate = {}
    if (body.tagline !== undefined) payload.tagline = body.tagline ?? null
    if (body.social_facebook !== undefined) payload.social_facebook = body.social_facebook ?? null
    if (body.social_youtube !== undefined) payload.social_youtube = body.social_youtube ?? null
    if (body.social_instagram !== undefined) payload.social_instagram = body.social_instagram ?? null
    if (body.social_twitter !== undefined) payload.social_twitter = body.social_twitter ?? null
    if (body.quick_links !== undefined) payload.quick_links = Array.isArray(body.quick_links) ? body.quick_links : null
    if (body.sections !== undefined) payload.sections = Array.isArray(body.sections) ? body.sections : null
    if (body.contact !== undefined) payload.contact = Array.isArray(body.contact) ? body.contact : null
    if (body.copyright_text !== undefined) payload.copyright_text = body.copyright_text ?? null
    if (body.privacy_url !== undefined) payload.privacy_url = body.privacy_url ?? null
    if (body.terms_url !== undefined) payload.terms_url = body.terms_url ?? null
    if (body.community_link !== undefined) payload.community_link = body.community_link ?? null
    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: 'لا توجد حقول للتحديث' }, { status: 400 })
    }
    const { data, error } = await supabase
      .from('footer_settings')
      // @ts-expect-error Supabase client infers never for update with custom Database type
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', 1)
      .select()
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error('[PATCH /api/footer]', err)
    return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 })
  }
}
