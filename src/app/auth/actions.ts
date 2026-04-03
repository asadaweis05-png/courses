"use server";

import { createServerSupabase } from "@/lib/supabase-server";

export async function loginAction(email: string, password: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    if (error.message?.includes("fetch")) {
       return { error: "Network error: Server cannot reach Supabase API. Please check environment variables on Vercel." };
    }
    return { error: error.message };
  }
  
  return { success: true };
}

export async function signupAction(email: string, password: string, fullName: string) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signUp({
    email, 
    password, 
    options: { data: { full_name: fullName } }
  });

  if (error) {
    if (error.message?.includes("fetch")) {
       return { error: "Network error: Server cannot reach Supabase API. Please check environment variables on Vercel." };
    }
    return { error: error.message };
  }

  return { success: true };
}
