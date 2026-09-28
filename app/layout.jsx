export const metadata = {
  title: "Destiny Studio — Scripts vidéo IA pour créateurs de contenu chrétien",
  description:
    "Génère en français des scripts de vidéos courtes chrétiennes avec l'IA — Faceless, caméra ou storytelling — pour pasteurs et créateurs francophones.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
