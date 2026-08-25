import { NextResponse } from "next/server";
import { createAuthenticatedClient } from "@/lib/supabase";
import { getCredits } from "@/lib/credits";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ credits: null }, { status: 200 });
  }

  try {
    const token = authHeader.slice(7);
    const authClient = createAuthenticatedClient(token);
    const { data: userData } = await authClient.auth.getUser();

    if (!userData?.user?.id) {
      return NextResponse.json({ credits: null }, { status: 200 });
    }

    const credits = await getCredits(userData.user.id);
    return NextResponse.json({ credits }, { status: 200 });
  } catch (err) {
    console.error("Erreur récupération crédits:", err);
    return NextResponse.json({ credits: null, error: true }, { status: 200 });
  }
                             }
