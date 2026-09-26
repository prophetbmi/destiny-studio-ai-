import Link from "next/link";
import { styles } from "@/styles/theme";
import Header from "@/components/Header";

export default function TermsPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Header />

        <h1 style={styles.legalTitle}>Conditions d'utilisation</h1>
        <p style={styles.legalUpdated}>Dernière mise à jour : 26 septembre 2026</p>

        <p style={styles.legalParagraph}>
          En créant un compte ou en utilisant Destiny Studio AI, tu acceptes les
          conditions décrites ci-dessous. L'application est gérée par Bienvenu
          Iteriteka, à titre individuel.
        </p>

        <h2 style={styles.legalHeading}>1. Description du service</h2>
        <p style={styles.legalParagraph}>
          Destiny Studio AI génère, à partir de tes indications (thème, verset,
          format), des scripts de vidéo ou de prédication destinés à la création de
          contenu chrétien sur les réseaux sociaux (TikTok, Reels, YouTube Shorts).
        </p>

        <h2 style={styles.legalHeading}>2. Ton compte</h2>
        <p style={styles.legalParagraph}>
          Tu es responsable de la confidentialité de tes identifiants et de tout ce
          qui est fait depuis ton compte. Un compte est personnel et ne doit pas être
          partagé.
        </p>

        <h2 style={styles.legalHeading}>3. Crédits</h2>
        <p style={styles.legalParagraph}>
          Chaque génération de script consomme des crédits. De nouveaux comptes
          reçoivent un nombre de crédits gratuits de départ. Aucun système d'achat de
          crédits n'est actif pour le moment ; ces conditions seront mises à jour dès
          qu'un système de paiement sera proposé, notamment concernant les modalités
          de remboursement.
        </p>

        <h2 style={styles.legalHeading}>4. Utilisation acceptable</h2>
        <p style={styles.legalParagraph}>Tu t'engages à ne pas utiliser le service pour :</p>
        <ul style={styles.legalList}>
          <li style={styles.legalListItem}>Générer ou diffuser un contenu illégal, diffamatoire ou trompeur</li>
          <li style={styles.legalListItem}>Contourner le système de crédits ou les limites techniques du service (rate limiting, vérification anti-robot, etc.)</li>
          <li style={styles.legalListItem}>Tenter d'accéder à des comptes ou des données qui ne t'appartiennent pas</li>
        </ul>

        <h2 style={styles.legalHeading}>5. Propriété des scripts générés</h2>
        <p style={styles.legalParagraph}>
          Les scripts générés à partir de ton compte t'appartiennent et tu es libre de
          les utiliser, modifier et publier comme tu le souhaites.
        </p>

        <h2 style={styles.legalHeading}>6. Disponibilité et garanties</h2>
        <p style={styles.legalParagraph}>
          Le service est fourni "en l'état", en développement actif. Nous faisons de
          notre mieux pour assurer sa disponibilité et la qualité des scripts générés,
          mais nous ne pouvons pas garantir une disponibilité continue ni l'absence
          totale d'erreurs, notamment parce que la génération s'appuie sur un modèle
          d'intelligence artificielle tiers (Anthropic Claude).
        </p>

        <h2 style={styles.legalHeading}>7. Limitation de responsabilité</h2>
        <p style={styles.legalParagraph}>
          Dans la mesure permise par la loi applicable, nous ne pourrons être tenus
          responsables des dommages indirects résultant de l'utilisation du service ou
          du contenu que tu publies à partir des scripts générés.
        </p>

        <h2 style={styles.legalHeading}>8. Modification de ces conditions</h2>
        <p style={styles.legalParagraph}>
          Ces conditions peuvent évoluer, notamment lors de l'ajout d'un système de
          paiement. En cas de changement important, nous l'indiquerons sur cette page.
        </p>

        <h2 style={styles.legalHeading}>9. Contact</h2>
        <p style={styles.legalParagraph}>
          Pour toute question sur ces conditions :{" "}
          <a href="mailto:destinyprogram@destinyprogramapp.com" style={styles.legalLink}>
            destinyprogram@destinyprogramapp.com
          </a>
        </p>

        <div style={styles.footerRow}>
          <Link href="/" style={styles.footerLink}>Accueil</Link>
          <Link href="/privacy" style={styles.footerLink}>Politique de confidentialité</Link>
        </div>
      </div>
    </div>
  );
}
