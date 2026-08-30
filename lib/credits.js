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

  const { data, error } = await client
    .rpc("deduct_credits", { p_user_id: userId, p_amount: amount })
    .single();

  if (error) {
    console.error("deductCredits() a échoué :", error.message);
    throw error;
  }

  if (!data.success) {
    throw new Error("Crédits insuffisants.");
  }

  return data.remaining_credits;
}
