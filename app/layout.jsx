export const metadata = {
  title: "Destiny Studio",
  description: "Générateur de scripts vidéo IA — Destiny Program",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
