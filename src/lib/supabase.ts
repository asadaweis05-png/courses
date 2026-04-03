import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  let url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL)?.replace(/^["']|["']$/g, "").trim();
  let key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY)?.replace(/^["']|["']$/g, "").trim();
  
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
