import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Évite que Next.js mette la réponse en cache : on veut une vraie requête à chaque appel.
export const dynamic = "force-dynamic";

/**
 * Ping de maintien d'activité pour Supabase (plan gratuit : pause après 7 jours sans activité).
 * Appelé automatiquement par le cron défini dans vercel.json.
 * Lecture seule : ne modifie aucune donnée.
 */
export async function GET() {
  const { error } = await supabase
    .from("credit_packs")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("keepalive Supabase a échoué :", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true, at: new Date().toISOString() }, { status: 200 });
}
