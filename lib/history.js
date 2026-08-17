export async function saveGeneration(client, userId, generation) {
  if (!client || !userId) return;

  const { mode, theme, verse, script } = generation;

  const { error } = await client
    .from("generations")
    .insert([{ user_id: userId, mode, theme, verse, script }]);

  if (error) {
    console.error("saveGeneration() a échoué :", error.message);
    // volontairement non bloquant — la génération a déjà été rendue à l'utilisateur
  }
}

export async function getHistory(client, userId) {
  if (!client || !userId) return [];

  const { data, error } = await client
    .from("generations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getHistory() a échoué :", error.message);
    return [];
  }

  return data;
}

export async function deleteHistory(client, userId, generationId) {
  if (!client || !userId) return;

  let query = client.from("generations").delete().eq("user_id", userId);

  if (generationId) {
    query = query.eq("id", generationId);
  }

  const { error } = await query;

  if (error) {
    console.error("deleteHistory() a échoué :", error.message);
    throw error; // ici on laisse remonter, car un échec de suppression doit être visible dans l'UI
  }
}
