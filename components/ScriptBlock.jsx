"use client";

import { styles } from "@/styles/theme";

export default function ScriptBlock({ label, text, coaching }) {
  return (
    <div style={styles.block}>
      <div style={styles.blockLabelRow}>
        <span style={styles.blockLabel}>{label}</span>
        {coaching && <span style={styles.miniScore}>{coaching.score}/10</span>}
      </div>
      <p style={styles.blockText}>{text}</p>
      {coaching?.note && <p style={styles.coachNote}>💡 {coaching.note}</p>}
    </div>
  );
}
