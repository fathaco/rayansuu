import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

let _client: SupabaseClient<Database> | null = null

function getClient(): SupabaseClient<Database> {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('supabaseUrl is required.')
  _client = createClient<Database>(url, key)
  return _client
}

/** Lazy-initialized so Vercel build (no env) does not run createClient at import time. */
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop) {
    return getClient()[prop as keyof SupabaseClient<Database>]
  },
})
