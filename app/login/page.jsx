"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { styles } from "@/styles/theme";
import { login } from "@/lib/auth";
import Header from "@/components/Header";

const TURNSTILE_SITE_KEY = "0x4AAAAAAFDYrqsB-rM7e6G4";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  const widgetRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const scriptId = "turnstile-script";

    function renderWidget() {
      if (!window.turnstile || !widgetRef.current || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(widgetRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => setCaptchaToken(token),
        "expired-callback": () => setCaptchaToken(""),
      });
    }

    if (document.getElementById(scriptId)) {
      renderWidget();
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.onload = renderWidget;
    document.body.appendChild(script);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!captchaToken) {
      setError("Merci de compléter la vérification anti-robot.");
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password, captchaToken });
      router.push("/");
    } catch (err) {
      setError(err.message);
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Header />

        <p style={styles.pitch}>Connecte-toi à ton compte.</p>

        <form onSubmit={handleSubmit} style={styles.card}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="toi@exemple.com"
            style={styles.input}
            required
          />

          <label style={{ ...styles.label, marginTop: 14 }}>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ton mot de passe"
            style={styles.input}
            required
          />

          <div ref={widgetRef} style={{ marginTop: 14 }} />

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          {error && <p style={styles.error}>{error}</p>}

          <p style={styles.usageNote}>
            Pas encore de compte ?{" "}
            <Link href="/signup" style={{ color: "#C9A24B", textDecoration: "underline" }}>
              Créer un compte
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
  }
