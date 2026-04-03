"use server";

import { createServerSupabase } from "@/lib/supabase-server";

export async function loginAction(email: string, password: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    return { error: `[DEBUG - hasUrl: ${hasUrl}] ${error.message}` };
  }
  
  return { success: true };
}

export async function signupAction(email: string, password: string, fullName: string) {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.signUp({
    email, 
    password, 
    options: { data: { full_name: fullName } }
  });

  if (error) {
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    return { error: `[DEBUG - hasUrl: ${hasUrl}] ${error.message}` };
  }

  return { success: true, session: data.session };
}
