"use client";

import { useState, useEffect } from "react";
import { styles } from "@/styles/theme";
import { storage } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import ScriptForm from "@/components/ScriptForm";
import ScriptResult from "@/components/ScriptResult";

const FREE_LIMIT = 3;
const CREATOR_CODE = "BMI@1998";
const LAST_RESULT_KEY = "last_result";

const MODE_META = {
  faceless: {
    pitch:
      "Génère un script de prédication prêt à tourner — verset vérifié, structure pensée pour la viralité, coaching de rétention inclus. Pour les créateurs de contenu chrétien francophone : TikTok, Reels, YouTube Shorts, Instagram.",
  },
  "face-camera": {
    pitch:
      "Génère un script pensé pour être parlé à la caméra — ton direct, connexion personnelle, rythme naturel à l'oral.",
  },
  storytelling: {
    pitch:
      "Génère un récit biblique mis en scène — immersion, tension narrative, message spirituel intégré à l'histoire.",
  },
  "court-metrage": {
    pitch:
      "Génère l'esquisse narrative d'un court métrage biblique — ouverture, montée dramatique, climax, message final.",
  },
};

async function fetchCredits() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;
    if (!accessToken) return null;

    const response = await fetch("/api/credits", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    return typeof data.credits === "number" ? data.credits : null;
  } catch {
    return null;
  }
}

export default function CreatePage({ params }) {
  const mode = params?.mode || "faceless";
  const meta = MODE_META[mode] || MODE_META.faceless;

  const [theme, setTheme] = useState("");
  const [verse, setVerse] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [usageCount, setUsageCount] = useState(null);
  const [creatorMode, setCreatorMode] = useState(false);
  const [showUnlock, setShowUnlock] = useState(false);
  const [unlockInput, setUnlockInput] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = await storage.get("usage_count");
        setUsageCount(stored ? parseInt(stored.value, 10) : 0);
      } catch {
        setUsageCount(0);
      }
      try {
        const storedCreator = await storage.get("creator_mode");
        if (storedCreator && storedCreator.value === "true") {
          setCreatorMode(true);
        }
      } catch {}
      try {
        const storedLast = await storage.get(LAST_RESULT_KEY);
        if (storedLast) {
          const parsed = JSON.parse(storedLast.value);
          if (parsed && parsed.mode === mode) {
            setTheme(parsed.theme || "");
            setVerse(parsed.verse || "");
            setResult(parsed.result || null);
          }
        }
      } catch {}

      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        setIsLoggedIn(true);
        const c = await fetchCredits();
        setCredits(c);
      }
    })();
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        storage.delete(LAST_RESULT_KEY).catch(() => {});
        setTheme("");
        setVerse("");
        setResult(null);

        if (event === "SIGNED_IN") {
          setIsLoggedIn(true);
          const c = await fetchCredits();
          setCredits(c);
        } else {
          setIsLoggedIn(false);
          setCredits(null);
        }
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const remaining = isLoggedIn
    ? credits
    : usageCount === null
    ? null
    : Math.max(0, FREE_LIMIT - usageCount);

  const locked = !creatorMode && (isLoggedIn ? credits !== null && credits <= 0 : remaining === 0);

  async function tryUnlock() {
    if (unlockInput.trim() === CREATOR_CODE) {
      setCreatorMode(true);
      setShowUnlock(false);
      setUnlockError("");
      try {
        await storage.set("creator_mode", "true");
      } catch {}
    } else {
      setUnlockError("Code incorrect.");
    }
  }

  async function handleGenerate() {
    if (!theme.trim() || locked) return;

    if (result) {
      const confirmed = window.confirm(
        "Un script a déjà été généré. Le remplacer par une nouvelle génération ?"
      );
      if (!confirmed) return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    try {
      const headers = { "Content-Type": "application/json" };

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token;
        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }
      } catch {}

      const response = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({ theme: theme.trim(), verse: verse.trim(), mode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur inconnue");
      }

      setResult(data);

      try {
        await storage.set(
          LAST_RESULT_KEY,
          JSON.stringify({
            result: data,
            mode,
            theme: theme.trim(),
            verse: verse.trim(),
            createdAt: new Date().toISOString(),
          })
        );
      } catch {}

      if (isLoggedIn) {
        const c = await fetchCredits();
        setCredits(c);
      } else if (!creatorMode) {
        const newCount = (usageCount || 0) + 1;
        setUsageCount(newCount);
        try {
          await storage.set("usage_count", String(newCount));
        } catch {}
      }
    } catch (e) {
      setError(`La génération a échoué : ${e.message || "erreur inconnue"}. Réessaie.`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.monogram}>D·P</div>
          <div>
            <div style={styles.brand}>DESTINY PROGRAM</div>
            <div style={styles.tagline}>Revealed Purpose</div>
          </div>
        </header>

        <p style={styles.verseAnchor}>
          « Mes temps sont entre tes mains » — Psaume 31:15
          <span style={styles.verseLink}> Ta destinée aussi.</span>
        </p>

        <p style={styles.pitch}>{meta.pitch}</p>

        <ScriptForm
          theme={theme}
          setTheme={setTheme}
          verse={verse}
          setVerse={setVerse}
          onGenerate={handleGenerate}
          loading={loading}
          locked={locked}
          creatorMode={creatorMode}
          usageCount={usageCount}
          remaining={remaining}
          freeLimit={FREE_LIMIT}
          showUnlock={showUnlock}
          setShowUnlock={setShowUnlock}
          unlockInput={unlockInput}
          setUnlockInput={setUnlockInput}
          unlockError={unlockError}
          onUnlock={tryUnlock}
          error={error}
          mode={mode}
          isLoggedIn={isLoggedIn}
        />

        {result && <ScriptResult result={result} />}
      </div>
    </div>
  );
        }
