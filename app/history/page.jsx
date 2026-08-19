"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { styles } from "@/styles/theme";
import { supabase, createAuthenticatedClient } from "@/lib/supabase";
import { getHistory, deleteHistory } from "@/lib/history";
import ScriptResult from "@/components/ScriptResult";

export default function HistoryPage() {
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);
  const [authClient, setAuthClient] = useState(null);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  return <div>Chargement...</div>;
}
