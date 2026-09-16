import type { SupabaseClient } from "@supabase/supabase-js"

// Resolve the owner allowlist in the database, so revoked access takes effect
// immediately without waiting for an old JWT to expire.
export const isPortfolioAdmin = async (supabase: SupabaseClient): Promise<boolean> => {
  const { data, error } = await supabase.rpc("is_portfolio_admin")
  return !error && data === true
}
