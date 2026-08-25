import { getMode } from "./modes";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

function extractJson(rawText) {
  let cleaned = rawText.replace(/```json|```/g, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

function validateParsedScript(parsed, outputType) {
  switch (outputType) {
    case "scenes":
      if (!Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
        throw new Error("Réponse Storytelling incomplète : aucune scène générée.");
      }
      break;

    case "cinema":
      if (!Array.isArray(parsed.scenes) || parsed.scenes.length === 0) {
        throw new Error("Réponse Court métrage incomplète : aucune scène générée.");
      }
      break;

    case "standard-4-block":
    default:
      if (!parsed.fr || !parsed.en) {
        throw new Error("Réponse incomplète de l'IA.");
      }
      break;
  }
}

export async function generateScript(mode, theme, verse) {
  const { SYSTEM_PROMPT, buildUserPrompt, outputType, maxTokens } = getMode(mode);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("Clé API manquante côté serveur (ANTHROPIC_API_KEY non définie).");
  }

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(theme, verse),
        },
      ],
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || "Erreur API");
  }

  const textBlock = data.content?.find((b) => b.type === "text");
  if (!textBlock) {
    throw new Error("Pas de réponse texte reçue.");
  }

  const parsed = extractJson(textBlock.text);

  validateParsedScript(parsed, outputType);

  return {
    ...parsed,
    outputType,
    usage: {
      inputTokens: data.usage?.input_tokens ?? null,
      outputTokens: data.usage?.output_tokens ?? null,
    },
  };
}
