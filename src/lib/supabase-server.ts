import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabase() {
  const cookieStore = await cookies()
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^["']|["']$/g, "").trim();
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.replace(/^["']|["']$/g, "").trim();
  console.log("SERVER ACTION ENV DEBUG: URL is", url, "KEY length is", key?.length);

  if (!url || !key) {
    console.warn("Server Supabase credentials missing! Prerendering may use placeholders.");
  }

  return createServerClient(
    url || 'https://placeholder.supabase.co',
    key || 'placeholder',
    {
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
