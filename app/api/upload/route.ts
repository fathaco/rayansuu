import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

const BUCKET = 'fatha'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file || !file.size) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `events/${crypto.randomUUID()}.${ext}`
    const buf = await file.arrayBuffer()
    const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buf, {
      contentType: file.type,
      upsert: false,
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ url: urlData.publicUrl })
  } catch (e) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
