import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
  
  if (url === 'https://placeholder.supabase.co' || key === 'placeholder') {
    if (process.env.NODE_ENV === 'production') {
      console.warn("Supabase credentials missing! This is expected during some build phases but will break runtime functionality.");
    }
  }

  return createBrowserClient(url, key);
}
