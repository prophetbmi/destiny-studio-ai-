export const metadata = {
  metadataBase: new URL("https://destinyprogramapp.com"),
  title: "Destiny Studio — Scripts vidéo IA pour créateurs de contenu chrétien",
  description:
    "Génère en français des scripts de vidéos courtes chrétiennes avec l'IA — Faceless, caméra ou storytelling — pour pasteurs et créateurs francophones.",
  verification: {
    google: "KvRwj3o3uD0Wvy3qCNnxtDAU_BuRH1h5I2s0efAZSak",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
