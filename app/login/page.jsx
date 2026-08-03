"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { styles } from "@/styles/theme";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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
