import { NextResponse } from "next/server";
import { generateScript } from "@/lib/anthropic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Requête invalide." },
      { status: 400 }
    );
  }

  const theme = typeof body?.theme === "string" ? body.theme.trim() : "";
  const verse = typeof body?.verse === "string" ? body.verse.trim() : "";
  const mode = typeof body?.mode === "string" && body.mode.trim() ? body.mode.trim() : "faceless";

  if (!theme) {
    return NextResponse.json(
      { error: "Écris d'abord un thème de prédication." },
      { status: 400 }
    );
  }

  try {
    const script = await generateScript(mode, theme, verse);
    return NextResponse.json(script, { status: 200 });
  } catch (err) {
    console.error("Erreur génération script:", err);

    const isConfigError = err.message?.includes("ANTHROPIC_API_KEY");
    const clientMessage = isConfigError
      ? "Le service de génération est momentanément indisponible."
      : err.message || "Erreur inconnue lors de la génération.";

    return NextResponse.json(
      { error: clientMessage },
      { status: isConfigError ? 503 : 502 }
    );
  }
}
