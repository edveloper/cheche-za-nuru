import { createClient } from "@supabase/supabase-js";

/**
 * Client-side Supabase client for auth operations.
 * Uses the browser's localStorage for session persistence.
 */
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
