"use client";

import { styles } from "@/styles/theme";

const LOADING_HINTS = {
  storytelling: "Écriture du récit en cours — quelques secondes de plus qu'un script court.",
  "court-metrage": "Construction du scénario complet — ça peut prendre un peu plus de temps.",
};

export default function ScriptForm({
  theme,
  setTheme,
  verse,
  setVerse,
  onGenerate,
  loading,
  locked,
  creatorMode,
  usageCount,
  remaining,
  freeLimit,
  showUnlock,
  setShowUnlock,
  unlockInput,
  setUnlockInput,
  unlockError,
  onUnlock,
  error,
  mode,
  isLoggedIn,
}) {
  const loadingHint = loading ? LOADING_HINTS[mode] : null;

  return (
    <div style={styles.card}>
      <label style={styles.label}>Thème de ta prédication</label>
      <textarea
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        placeholder="Ex : la peur de l'échec, le pardon, la patience dans l'attente..."
        style={styles.textarea}
        rows={3}
        disabled={locked}
      />

      <label style={{ ...styles.label, marginTop: 14 }}>Verset à utiliser (optionnel)</label>
      <input
        value={verse}
        onChange={(e) => setVerse(e.target.value)}
        placeholder="Ex : Psaume 31:15 — laisse vide pour que le verset soit choisi automatiquement"
        style={styles.input}
        disabled={locked}
      />

      <button
        onClick={onGenerate}
        disabled={loading || !theme.trim() || locked}
        style={{
          ...styles.button,
          opacity: loading || !theme.trim() || locked ? 0.5 : 1,
          cursor: loading || !theme.trim() || locked ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Génération..." : "Générer le script"}
      </button>

      {loadingHint && <p style={styles.usageNote}>{loadingHint}</p>}

      {creatorMode ? (
        <p style={styles.creatorNote}>✦ Générations illimitées — mode concepteur</p>
      ) : (
        <>
          {isLoggedIn ? (
            <p style={styles.usageNote}>
              {remaining === null
                ? "Crédits : —"
                : `${remaining} crédit${remaining !== 1 ? "s" : ""} restant${remaining !== 1 ? "s" : ""}`}
            </p>
          ) : (
            usageCount !== null &&
            !locked && (
              <p style={styles.usageNote}>
                {remaining} génération{remaining !== 1 ? "s" : ""} gratuite{remaining !== 1 ? "s" : ""} restante{remaining !== 1 ? "s" : ""}
              </p>
            )
          )}
          <p style={styles.unlockLink} onClick={() => setShowUnlock((v) => !v)}>
            code créateur ?
          </p>
          {showUnlock && (
            <div style={styles.unlockRow}>
              <input
                value={unlockInput}
                onChange={(e) => setUnlockInput(e.target.value)}
                placeholder="Code"
                style={styles.unlockInput}
              />
              <button onClick={onUnlock} style={styles.unlockButton}>
                OK
              </button>
            </div>
          )}
          {unlockError && <p style={styles.error}>{unlockError}</p>}
        </>
      )}

      {locked && (
        <div style={styles.paywall}>
          <p style={styles.paywallTitle}>
            {isLoggedIn ? "Crédits épuisés" : "Limite gratuite atteinte"}
          </p>
          <p style={styles.paywallText}>
            {isLoggedIn
              ? "Tu n'as plus de crédits disponibles. Achète un pack de crédits pour continuer à produire tes scripts."
              : `Tu as utilisé tes ${freeLimit} générations gratuites. Passe à l'accès illimité pour continuer à produire tes scripts.`}
          </p>
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
          }
