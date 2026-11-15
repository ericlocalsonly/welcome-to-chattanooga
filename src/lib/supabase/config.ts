export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
/** Publishable key (sb_publishable_…) preferred; legacy anon key accepted. Both are safe in the browser — RLS protects data. */
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
