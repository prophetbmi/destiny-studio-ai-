import { supabase } from "./supabase";

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return null;
  }
  return { id: data.user.id, email: data.user.email };
}

export async function createUser({ email, password }) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new Error(translateAuthError(error));
  }
  if (!data?.user) {
    throw new Error("La création du compte a échoué. Réessaie.");
  }

  return { id: data.user.id, email: data.user.email };
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

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

  return "Une erreur est survenue. Réessaie.";
}
