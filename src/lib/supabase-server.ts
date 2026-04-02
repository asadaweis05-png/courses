import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabase() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  if (url === 'https://placeholder.supabase.co' || key === 'placeholder') {
    if (process.env.NODE_ENV === 'production') {
      console.warn("Server Supabase credentials missing! Check Vercel environment variables.");
    }
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try { cookieStore.set(name, value, options) } catch {}
        })
      },
    },
  })
}
