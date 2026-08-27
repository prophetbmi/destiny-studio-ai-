import { NextResponse } from "next/server";
import { generateScript } from "@/lib/anthropic";
import { createAuthenticatedClient } from "@/lib/supabase";
import { saveGeneration } from "@/lib/history";
import { getMode } from "@/lib/modes";
import { getCredits, deductCredits } from "@/lib/credits";

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

  // Identifier l'utilisateur connecté, s'il y en a un
  let userId = null;
  let userEmail = null;
  let authClient = null;
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7);
      authClient = createAuthenticatedClient(token);
      const { data: userData } = await authClient.auth.getUser();
      if (userData?.user?.id) {
        userId = userData.user.id;
        userEmail = userData.user.email;
      }
    } catch (authErr) {
      console.error("Vérification du token échouée :", authErr);
    }
  }

  const isCreator = Boolean(userEmail && userEmail === process.env.CREATOR_EMAIL);

  // Vérification des crédits — utilisateurs connectés, sauf le compte concepteur
  const modeConfig = getMode(mode);
  const creditCost = modeConfig.creditCost || 1;

  if (userId && !isCreator) {
    try {
      const currentCredits = await getCredits(userId);
      if (currentCredits < creditCost) {
        return NextResponse.json(
          { error: "Crédits insuffisants. Achète un pack de crédits pour continuer." },
          { status: 402 }
        );
      }
    } catch (creditsErr) {
      console.error("Vérification des crédits échouée :", creditsErr);
      return NextResponse.json(
        { error: "Impossible de vérifier tes crédits pour le moment. Réessaie dans un instant." },
        { status: 503 }
      );
    }
  }

  try {
    const script = await generateScript(mode, theme, verse);

    console.log("Usage tokens:", {
      mode,
      creditCost,
      isCreator,
      inputTokens: script.usage?.inputTokens,
      outputTokens: script.usage?.outputTokens,
    });

    // Déduction des crédits — connecté et pas le compte concepteur, après génération réussie
    if (userId && !isCreator) {
      try {
        await deductCredits(userId, creditCost);
      } catch (deductErr) {
        console.error("Déduction des crédits échouée :", deductErr);
      }
    }

    // Sauvegarde dans l'historique — non bloquant, uniquement si l'utilisateur est connecté
    if (userId && authClient) {
      try {
        await saveGeneration(authClient, userId, {
          mode,
          theme,
          verse,
          script,
        });
      } catch (historyErr) {
        console.error("Sauvegarde historique échouée (non bloquant) :", historyErr);
      }
    }

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
