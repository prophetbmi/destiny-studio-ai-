"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { styles } from "@/styles/theme";
import Header from "@/components/Header";

export default function CreditsPage() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/api/credit-packs");
        const data = await response.json();
        setPacks(Array.isArray(data.packs) ? data.packs : []);
      } catch {
        setPacks([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Header />

        <p style={styles.pitch}>
          Choisis un pack de crédits. L'achat en ligne arrive bientôt — en
          attendant, voici les packs et leurs tarifs.
        </p>

        {loading ? (
          <p style={styles.usageNote}>Chargement des packs...</p>
        ) : packs.length === 0 ? (
          <p style={styles.usageNote}>Aucun pack disponible pour le moment.</p>
        ) : (
          <div style={styles.modeGrid}>
            {packs.map((pack) => (
              <div key={pack.id} style={styles.packCard}>
                <div style={styles.packHeaderRow}>
                  <span style={styles.packLabel}>{pack.label}</span>
                  <span style={styles.packPrice}>${Number(pack.price_usd).toFixed(2)}</span>
                </div>
                <p style={styles.packCredits}>
                  {pack.credits} crédit{pack.credits !== 1 ? "s" : ""}
                </p>
                <button style={styles.packButtonDisabled} disabled>
                  Bientôt disponible
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={styles.footerRow}>
          <Link href="/" style={styles.footerLink}>Accueil</Link>
        </div>
      </div>
    </div>
  );
}
