import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    if (typeof window !== 'undefined') {
       // This is a runtime error in the browser
       console.error("CRITICAL: Supabase credentials missing! Add them to Vercel/environment settings.");
    }
    // Return placeholders only to avoid crashing during 'next build' prerendering
    return createBrowserClient(
      url || 'https://placeholder.supabase.co', 
      key || 'placeholder'
    );
  }

  return createBrowserClient(url, key);
}
