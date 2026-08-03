"use client";

import { useState } from "react";
import { styles } from "@/styles/theme";

function formatScenesForCopy(result) {
  const lines = [];

  lines.push("Verset :");
  lines.push(result.verset || "");
  lines.push("");

  lines.push("Titre :");
  lines.push(result.titre || "");
  lines.push("");

  if (result.resume) {
    lines.push("Résumé :");
    lines.push(result.resume);
    lines.push("");
  }

  const personnages = Array.isArray(result.personnages) ? result.personnages : [];
  if (personnages.length > 0) {
    lines.push("Personnages :");
    for (const p of personnages) {
      lines.push(`- ${p.nom || "?"}${p.description ? ` : ${p.description}` : ""}`);
    }
    lines.push("");
  }

  const scenes = Array.isArray(result.scenes) ? result.scenes : [];
  for (const scene of scenes) {
    const header = [`Scène ${scene.numero ?? "?"}`];
    if (scene.lieu) header.push(scene.lieu);
    if (scene.moment) header.push(scene.moment);
    lines.push(header.join(" — "));

    if (scene.description_visuelle) lines.push(scene.description_visuelle);
    if (scene.action) lines.push(scene.action);

    const dialogue = Array.isArray(scene.dialogue) ? scene.dialogue : [];
    for (const d of dialogue) {
      lines.push(`${d.personnage || "?"} : ${d.texte || ""}`);
    }

    lines.push("");
  }

  if (result.message_final) {
    lines.push("Message final :");
    lines.push(result.message_final);
  }

  return lines.join("\n").trim();
}

export default function ScriptResultScenes({ result }) {
  const [copyState, setCopyState] = useState("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatScenesForCopy(result));
      setCopyState("copied");
    } catch {
      setCopyState("error");
    } finally {
      setTimeout(() => setCopyState("idle"), 2000);
    }
  }

  const { verset, titre, resume, personnages = [], scenes = [], message_final } = result;

  return (
    <div style={styles.resultCard}>
      <div style={styles.copyButtonRow}>
        <button onClick={handleCopy} style={styles.copyButton}>
          {copyState === "copied" ? "Copié ✓" : copyState === "error" ? "Échec — réessaie" : "Copier"}
        </button>
      </div>

      <p style={styles.verseTag}>{verset}</p>

      <h2 style={styles.storyTitle}>{titre}</h2>
      {resume && <p style={styles.storyResume}>{resume}</p>}

      {personnages.length > 0 && (
        <div style={styles.storyCharactersRow}>
          {personnages.map((p, i) => (
            <span key={i} style={styles.storyCharacterChip} title={p.description}>
              {p.nom}
            </span>
          ))}
        </div>
      )}

      <h3 style={styles.blockHeading}>Scènes</h3>
      {scenes.map((scene) => (
        <div key={scene.numero} style={styles.storySceneCard}>
          <div style={styles.storySceneHeader}>
            <span style={styles.storySceneNumber}>Scène {scene.numero}</span>
            <span style={styles.storySceneMeta}>
              {scene.lieu}
              {scene.moment ? ` · ${scene.moment}` : ""}
            </span>
          </div>

          {scene.description_visuelle && (
            <p style={styles.storySceneVisual}>{scene.description_visuelle}</p>
          )}

          {scene.action && <p style={styles.storySceneAction}>{scene.action}</p>}

          {Array.isArray(scene.dialogue) &&
            scene.dialogue.map((d, i) => (
              <p key={i} style={styles.storyDialogueLine}>
                <span style={styles.storyDialogueName}>{d.personnage} : </span>
                {d.texte}
              </p>
            ))}
        </div>
      ))}

      {message_final && <p style={styles.storyMessageFinal}>{message_final}</p>}
    </div>
  );
}
