import { createServiceRoleClient } from "./supabase";

const DEFAULT_CREDITS = 5;

export async function getCredits(userId) {
  if (!userId) return 0;

  const client = createServiceRoleClient();

  const { data, error } = await client
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("getCredits() a échoué :", error.message);
    throw error;
  }

  if (data) {
    return data.credits;
  }

  const { data: created, error: insertErr } = await client
    .from("user_credits")
    .insert([{ user_id: userId, credits: DEFAULT_CREDITS }])
    .select("credits")
    .single();

  if (insertErr) {
    console.error("getCredits() création a échoué :", insertErr.message);
    throw insertErr;
  }

  return created.credits;
}

export async function deductCredits(userId, amount) {
  if (!userId || !amount) return;

  const client = createServiceRoleClient();

  const currentCredits = await getCredits(userId);

  if (currentCredits < amount) {
    throw new Error("Crédits insuffisants.");
  }

  const { error } = await client
    .from("user_credits")
    .update({ credits: currentCredits - amount, updated_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) {
    console.error("deductCredits() a échoué :", error.message);
    throw error;
  }
             }
