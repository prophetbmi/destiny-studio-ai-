import { styles } from "@/styles/theme";

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.monogram}>D·P</div>
      <div>
        <div style={styles.brand}>DESTINY PROGRAM</div>
        <div style={styles.tagline}>Revealed Purpose</div>
      </div>
    </header>
  );
}
