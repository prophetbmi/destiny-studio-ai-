import Link from "next/link";
import { styles } from "@/styles/theme";
import Header from "@/components/Header";

export default function PrivacyPage() {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Header />

        <h1 style={styles.legalTitle}>Politique de confidentialité</h1>
        <p style={styles.legalUpdated}>Dernière mise à jour : 26 septembre 2026</p>

        <p style={styles.legalParagraph}>
          Destiny Studio AI (l'application derrière Destiny Program) est gérée par
          Bienvenu Iteriteka, à titre individuel. L'application n'est pas encore
          exploitée par une société enregistrée. Cette page explique quelles données
          sont collectées quand tu utilises l'application, et comment elles sont
          utilisées.
        </p>

        <h2 style={styles.legalHeading}>1. Données que nous collectons</h2>
        <ul style={styles.legalList}>
          <li style={styles.legalListItem}>Ton adresse email et ton mot de passe (géré par Supabase, notre fournisseur d'authentification)</li>
          <li style={styles.legalListItem}>Les thèmes, versets et paramètres que tu saisis pour générer un script</li>
          <li style={styles.legalListItem}>L'historique des scripts que tu as générés, pour que tu puisses les retrouver</li>
          <li style={styles.legalListItem}>Ton solde de crédits et l'usage que tu en fais</li>
        </ul>

        <h2 style={styles.legalHeading}>2. Comment ces données sont utilisées</h2>
        <p style={styles.legalParagraph}>
          Ces données servent uniquement à faire fonctionner le service : générer tes
          scripts, gérer ton compte, ton historique et tes crédits. Elles ne sont ni
          vendues, ni partagées à des fins publicitaires.
        </p>

        <h2 style={styles.legalHeading}>3. Services tiers</h2>
        <p style={styles.legalParagraph}>
          Pour fonctionner, l'application s'appuie sur des prestataires techniques qui
          traitent une partie de ces données en notre nom :
        </p>
        <ul style={styles.legalList}>
          <li style={styles.legalListItem}><strong>Supabase</strong> — authentification et base de données</li>
          <li style={styles.legalListItem}><strong>Anthropic (Claude)</strong> — génération du contenu de tes scripts à partir de ce que tu saisis</li>
          <li style={styles.legalListItem}><strong>Vercel</strong> — hébergement de l'application</li>
          <li style={styles.legalListItem}><strong>Cloudflare Turnstile</strong> — vérification anti-robot à l'inscription et à la connexion</li>
        </ul>

        <h2 style={styles.legalHeading}>4. Paiement</h2>
        <p style={styles.legalParagraph}>
          À ce jour, l'application ne propose pas encore d'achat de crédits en ligne.
          Aucune donnée bancaire n'est donc collectée. Cette politique sera mise à
          jour dès qu'un moyen de paiement sera activé.
        </p>

        <h2 style={styles.legalHeading}>5. Conservation des données</h2>
        <p style={styles.legalParagraph}>
          Tes données sont conservées tant que ton compte existe. Si tu supprimes ton
          compte ou demandes la suppression de tes données, elles sont effacées de
          notre base dans un délai raisonnable.
        </p>

        <h2 style={styles.legalHeading}>6. Tes droits</h2>
        <p style={styles.legalParagraph}>
          Tu peux à tout moment demander à consulter, corriger ou supprimer tes
          données, en écrivant à l'adresse ci-dessous.
        </p>

        <h2 style={styles.legalHeading}>7. Contact</h2>
        <p style={styles.legalParagraph}>
          Pour toute question sur cette politique ou tes données personnelles :{" "}
          <a href="mailto:destinyprogram@destinyprogramapp.com" style={styles.legalLink}>
            destinyprogram@destinyprogramapp.com
          </a>
        </p>

        <div style={styles.footerRow}>
          <Link href="/" style={styles.footerLink}>Accueil</Link>
          <Link href="/terms" style={styles.footerLink}>Conditions d'utilisation</Link>
        </div>
      </div>
    </div>
  );
}
