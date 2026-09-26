import { supabase, createServiceRoleClient } from "./supabase";

/**
 * Retourne les packs de crédits actifs, triés pour l'affichage.
 * Lecture publique (RLS autorise select where active = true).
 */
export async function getCreditPacks() {
  const { data, error } = await supabase
    .from("credit_packs")
    .select("id, label, credits, price_usd")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getCreditPacks() a échoué :", error.message);
    throw error;
  }

  return data;
}

/**
 * Crée un achat en attente pour un utilisateur et un pack donnés.
 * Ne débite rien et ne crédite rien — sert de point d'entrée pour un futur
 * prestataire de paiement (le checkout se fera à partir de cette ligne).
 */
export async function createPendingPurchase(userId, packId) {
  if (!userId || !packId) {
    throw new Error("createPendingPurchase() nécessite userId et packId.");
  }

  const client = createServiceRoleClient();

  const { data: pack, error: packError } = await client
    .from("credit_packs")
    .select("id, credits, price_usd, active")
    .eq("id", packId)
    .maybeSingle();

  if (packError) {
    console.error("createPendingPurchase() lecture du pack a échoué :", packError.message);
    throw packError;
  }

  if (!pack || !pack.active) {
    throw new Error("Pack de crédits introuvable ou inactif.");
  }

  const { data: purchase, error: insertError } = await client
    .from("credit_purchases")
    .insert([
      {
        user_id: userId,
        pack_id: pack.id,
        credits_granted: pack.credits,
        amount_usd: pack.price_usd,
        status: "pending",
      },
    ])
    .select("id, pack_id, credits_granted, amount_usd, status, created_at")
    .single();

  if (insertError) {
    console.error("createPendingPurchase() création a échoué :", insertError.message);
    throw insertError;
  }

  return purchase;
}

/**
 * Valide un achat déjà créé et crédite l'utilisateur correspondant.
 * Idempotente : peut être appelée plusieurs fois avec le même purchaseId
 * sans créditer deux fois (protection contre les webhooks envoyés en double).
 *
 * provider / providerReference sont optionnels au moment de l'appel — ils
 * servent à tracer quel prestataire a confirmé le paiement, une fois choisi.
 */
export async function completePurchase(purchaseId, provider = null, providerReference = null) {
  if (!purchaseId) {
    throw new Error("completePurchase() nécessite purchaseId.");
  }

  const client = createServiceRoleClient();

  const { data, error } = await client
    .rpc("complete_purchase", {
      p_purchase_id: purchaseId,
      p_provider: provider,
      p_provider_reference: providerReference,
    })
    .single();

  if (error) {
    console.error("completePurchase() a échoué :", error.message);
    throw error;
  }

  if (!data.success) {
    throw new Error("Achat introuvable, impossible de créditer.");
  }

  return data.new_balance;
}
