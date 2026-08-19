"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { styles } from "@/styles/theme";
import { supabase, createAuthenticatedClient } from "@/lib/supabase";
import { getHistory, deleteHistory } from "@/lib/history";
import ScriptResult from "@/components/ScriptResult";

export default function HistoryPage() {
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);
  const [authClient, setAuthClient] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;

        if (!session) {
          setUser(null);
          setLoadingUser(false);
          return;
        }

        setUser(session.user);
        const client = createAuthenticatedClient(session.access_token);
        setAuthClient(client);
        setLoadingUser(false);

        setLoadingItems(true);
        const history = await getHistory(client, session.user.id);
        setItems(history);
      } catch (e) {
        setError("Impossible de charger l'historique. Réessaie plus tard.");
      } finally {
        setLoadingItems(false);
      }
    })();
  }, []);

  async function handleDelete(id) {
    if (!authClient || !user) return;

    const confirmed = window.confirm(
      "Supprimer définitivement cette génération ? Cette action est irréversible."
    );
    if (!confirmed) return;

    try {
      await deleteHistory(authClient, user.id, id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (e) {
      alert("La suppression a échoué. Réessaie.");
    }
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  function formatDate2(iso) {
    return iso;
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

        <div style={{ marginTop: 10, marginBottom: 16 }}>
          <Link href="/" style={{ ...styles.unlockLink, textDecoration: "underline" }}>
            ← Retour à l'accueil
          </Link>
        </div>

        <p style={styles.pitch}>Historique de tes créations</p>

        {loadingUser && <p style={styles.usageNote}>Chargement…</p>}

        {!loadingUser && !user && (
          <div style={styles.resultCard}>
            <p style={styles.usageNote}>
              Connecte-toi pour voir l'historique de tes créations.
            </p>
            <Link href="/login" style={{ ...styles.unlockLink, textDecoration: "underline" }}>
              Se connecter
            </Link>
          </div>
        )}

        {!loadingUser && user && loadingItems && (
          <p style={styles.usageNote}>Chargement de ton historique…</p>
        )}

        {!loadingUser && user && error && (
          <p style={styles.usageNote}>{error}</p>
        )}

        {!loadingUser && user && !loadingItems && !error && items.length === 0 && (
          <p style={styles.usageNote}>
            Aucune génération pour l'instant. Crée ton premier script !
          </p>
        )}{!loadingUser && user && !loadingItems && items.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((item) => (
              <div key={item.id} style={styles.modeCard}>
                <div style={styles.modeCardHeaderRow}>
                  <span style={styles.modeCardTitle}>
                    {item.theme || "Sans thème"}
                  </span>
                  <span style={styles.modeBadgeAvailable}>{item.mode}</span>
                </div>
                <p style={styles.modeCardDescription}>
                  {item.verse ? item.verse : "Verset non précisé"}
                </p>
                <p style={styles.usageNote}>{formatDate(item.created_at)}</p>

                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === item.id ? null : item.id)
                    }
                    style={styles.unlockButton}
                  >
                    {expandedId === item.id ? "Masquer" : "Voir le script"}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={styles.unlockButton}
                  >
                    Supprimer
                  </button>
                </div>

                {expandedId === item.id && item.script && (
                  <div style={{ marginTop: 12 }}>
                    <ScriptResult result={item.script} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
