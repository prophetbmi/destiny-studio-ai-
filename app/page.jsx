import Link from "next/link";
import { styles } from "@/styles/theme";

const MODES = [
  {
    id: "faceless",
    title: "Faceless chrétien",
    description:
      "Scripts de prédication courts, sans visage à l'écran. Verset vérifié, structure pensée pour la viralité.",
    active: true,
  },
  {
    id: "face-camera",
    title: "Face caméra",
    description:
      "Scripts pensés pour être parlés à la caméra, ton direct, rythme adapté à une présence personnelle plutôt qu'à une voix off.",
    active: true,
  },
  {
    id: "storytelling",
    title: "Storytelling biblique",
    description:
      "Histoires bibliques mises en scène — personnages, tension narrative, message spirituel intégré à un récit.",
    active: true,
  },
  {
    id: "court-metrage",
    title: "Court métrage biblique",
    description:
      "Structure narrative complète pour une vidéo longue — scènes, dialogues, arc narratif.",
    active: true,
  },
];

export default function Home() {
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

        <p style={styles.pitch}>Choisis ton format de création.</p>

        <div style={styles.modeGrid}>
          {MODES.map((mode) =>
            mode.active ? (
              <Link key={mode.id} href={`/create/${mode.id}`} style={styles.modeCard}>
                <div style={styles.modeCardHeaderRow}>
                  <span style={styles.modeCardTitle}>{mode.title}</span>
                  <span style={styles.modeBadgeAvailable}>Disponible</span>
                </div>
                <p style={styles.modeCardDescription}>{mode.description}</p>
                <span style={styles.modeCardAction}>Créer</span>
              </Link>
            ) : (
              <div key={mode.id} style={styles.modeCardDisabled} aria-disabled="true">
                <div style={styles.modeCardHeaderRow}>
                  <span style={styles.modeCardTitle}>{mode.title}</span>
                  <span style={styles.modeBadgeSoon}>Bientôt disponible</span>
                </div>
                <p style={styles.modeCardDescription}>{mode.description}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
                  }
