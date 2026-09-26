import { NextResponse } from "next/server";
import { getCreditPacks } from "@/lib/purchases";

export async function GET() {
  try {
    const packs = await getCreditPacks();
    return NextResponse.json({ packs }, { status: 200 });
  } catch (err) {
    console.error("Erreur récupération packs de crédits:", err);
    return NextResponse.json({ packs: [], error: true }, { status: 200 });
  }
}
