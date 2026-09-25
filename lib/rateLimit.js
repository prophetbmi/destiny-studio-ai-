import { createServiceRoleClient } from "./supabase";

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 5;

export async function checkRateLimit(identifier) {
  const client = createServiceRoleClient();
  const windowStart = new Date(Date.now() - WINDOW_SECONDS * 1000).toISOString();

  const { count, error } = await client
    .from("rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("identifier", identifier)
    .gte("created_at", windowStart);

  if (error) {
    console.error("checkRateLimit() a échoué :", error.message);
    return { allowed: true };
  }

  if (count >= MAX_REQUESTS) {
    return { allowed: false };
  }

  const { error: insertErr } = await client
    .from("rate_limits")
    .insert([{ identifier }]);

  if (insertErr) {
    console.error("checkRateLimit() insertion échouée :", insertErr.message);
  }

  return { allowed: true };
}
