import { supabase } from "./supabase";

// Vérifie le mot de passe contre l'API k-anonymity de HaveIBeenPwned,
// sans jamais transmettre le mot de passe en clair (seulement les 5
// premiers caractères de son empreinte SHA-1). En cas d'échec du
// service tiers (réseau, indisponibilité), on laisse passer plutôt
// que de bloquer l'inscription — la vérification est un bonus, pas
// une dépendance critique.
async function isPasswordPwned(password) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();

    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!res.ok) return false;

    const text = await res.text();
    return text.split("\n").some((line) => line.split(":")[0].trim() === suffix);
  } catch {
    return false;
  }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return null;
  }
  return { id: data.user.id, email: data.user.email };
}

export async function createUser({ email, password, captchaToken }) {
  if (await isPasswordPwned(password)) {
    throw new Error(
      "Ce mot de passe a été trouvé dans une fuite de données connue. Choisis-en un autre."
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { captchaToken },
  });

  if (error) {
    throw new Error(translateAuthError(error));
  }
  if (!data?.user) {
    throw new Error("La création du compte a échoué. Réessaie.");
  }

  return { id: data.user.id, email: data.user.email };
}

export async function login({ email, password, captchaToken }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken },
  });

  if (error) {
    throw new Error(translateAuthError(error));
  }
  if (!data?.user) {
    throw new Error("La connexion a échoué. Réessaie.");
  }

  return { id: data.user.id, email: data.user.email };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error("La déconnexion a échoué. Réessaie.");
  }
}

function translateAuthError(error) {
  const msg = (error.message || "").toLowerCase();

  if (msg.includes("already registered") || msg.includes("already exists")) {
    return "Un compte existe déjà avec cet email.";
  }
  if (msg.includes("invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }
  if (msg.includes("password") && msg.includes("6")) {
    return "Le mot de passe doit contenir au moins 6 caractères.";
  }
  if (msg.includes("invalid") && msg.includes("email")) {
    return "Adresse email invalide.";
  }
  if (msg.includes("rate limit")) {
    return "Trop de tentatives. Réessaie dans quelques minutes.";
  }
  if (msg.includes("captcha")) {
    return "Vérification anti-robot échouée. Réessaie.";
  }

  return "Une erreur est survenue. Réessaie.";
}
