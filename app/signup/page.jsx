"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { styles } from "@/styles/theme";
import { createUser } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await createUser({ email: email.trim(), password });
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

        <p style={styles.pitch}>Crée ton compte pour commencer.</p>

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
            placeholder="6 caractères minimum"
            style={styles.input}
            required
            minLength={6}
          />

          <label style={{ ...styles.label, marginTop: 14 }}>Confirmer le mot de passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Retape ton mot de passe"
            style={styles.input}
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>

          {error && <p style={styles.error}>{error}</p>}

          <p style={styles.usageNote}>
            Déjà un compte ?{" "}
            <Link href="/login" style={{ color: "#C9A24B", textDecoration: "underline" }}>
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
