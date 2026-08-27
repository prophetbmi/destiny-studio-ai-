import { NextResponse } from "next/server";
import { createAuthenticatedClient } from "@/lib/supabase";
import { getCredits } from "@/lib/credits";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ credits: null, isCreator: false }, { status: 200 });
  }

  try {
    const token = authHeader.slice(7);
    const authClient = createAuthenticatedClient(token);
    const { data: userData } = await authClient.auth.getUser();

    if (!userData?.user?.id) {
      return NextResponse.json({ credits: null, isCreator: false }, { status: 200 });
    }

    const isCreator = userData.user.email === process.env.CREATOR_EMAIL;

    if (isCreator) {
      return NextResponse.json({ credits: null, isCreator: true }, { status: 200 });
    }

    const credits = await getCredits(userData.user.id);
    return NextResponse.json({ credits, isCreator: false }, { status: 200 });
  } catch (err) {
    console.error("Erreur récupération crédits:", err);
    return NextResponse.json({ credits: null, isCreator: false, error: true }, { status: 200 });
  }
  }
