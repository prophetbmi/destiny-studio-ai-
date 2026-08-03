"use client";

import { useState } from "react";
import { styles } from "@/styles/theme";
import ScriptBlock from "./ScriptBlock";
import ScriptResultScenes from "./ScriptResultScenes";
import ScriptResultCinema from "./ScriptResultCinema";

function formatResultForCopy(result) {
  return `Verset :
${result.verset}

FR :
Accroche :
${result.fr.accroche}
Tension :
${result.fr.tension}
Révélation :
${result.fr.revelation}
Appel :
${result.fr.appel}

EN :
Hook :
${result.en.hook}
Tension :
${result.en.tension}
Revelation :
${result.en.revelation}
Call :
${result.en.call}`;
}

export default function ScriptResult({ result }) {
  const [copyState, setCopyState] = useState("idle");

  if (result.outputType === "scenes") {
    return <ScriptResultScenes result={result} />;
  }
  if (result.outputType === "cinema") {
    return <ScriptResultCinema result={result} />;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatResultForCopy(result));
      setCopyState("copied");
    } catch {
      setCopyState("error");
    } finally {
      setTimeout(() => setCopyState("idle"), 2000);
    }
  }

  return (
    <div style={styles.resultCard}>
      <div style={styles.copyButtonRow}>
        <button onClick={handleCopy} style={styles.copyButton}>
          {copyState === "copied" ? "Copié ✓" : copyState === "error" ? "Échec — réessaie" : "Copier"}
        </button>
      </div>

      <p style={styles.verseTag}>{result.verset}</p>

      <div style={styles.blockHeading}>Français</div>
      <ScriptBlock label="Accroche" text={result.fr.accroche} coaching={result.coaching?.accroche} />
      <ScriptBlock label="Tension" text={result.fr.tension} coaching={result.coaching?.tension} />
      <ScriptBlock label="Révélation" text={result.fr.revelation} coaching={result.coaching?.revelation} />
      <ScriptBlock label="Appel" text={result.fr.appel} coaching={result.coaching?.appel} />

      <div style={styles.blockHeading}>English</div>
      <ScriptBlock label="Hook" text={result.en.hook} />
      <ScriptBlock label="Tension" text={result.en.tension} />
      <ScriptBlock label="Revelation" text={result.en.revelation} />
      <ScriptBlock label="Call" text={result.en.call} />

      {result.coaching && (
        <div style={styles.coachingPanel}>
          <div style={styles.coachingHeader}>
            <span>Score de partageabilité</span>
            <span style={styles.scoreGlobal}>{result.coaching.score_global}/10</span>
          </div>
        </div>
      )}
    </div>
  );
      }
