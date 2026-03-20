import { createClient } from "@supabase/supabase-js";

export function createSupabaseBrowserClient(
  supabaseUrl: string,
  supabaseAnonKey: string
) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Keep the session in browser storage; the API will use the access token.
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

