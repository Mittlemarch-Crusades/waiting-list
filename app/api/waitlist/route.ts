import { NextResponse } from "next/server";

const PLAYSTYLES = ["PvP", "PvE", "Exploration", "Crafting", "Raids"] as const;

type WaitlistPayload = {
  email?: string;
  playerName?: string;
  favoriteMmorpg?: string;
  playstyle?: string;
  alphaTesting?: string;
};

function validatePayload(body: WaitlistPayload) {
  const email = body.email?.trim().toLowerCase() ?? "";
  const playerName = body.playerName?.trim() ?? null;
  const favoriteMmorpg = body.favoriteMmorpg?.trim() ?? "";
  const playstyle = body.playstyle?.trim() ?? "";
  const alphaTesting = body.alphaTesting === "Yes";

  if (!/\S+@\S+\.\S+/.test(email)) {
    return { error: "Enter a valid email address." };
  }

  if (!favoriteMmorpg) {
    return { error: "Favorite MMORPG is required." };
  }

  if (!PLAYSTYLES.includes(playstyle as (typeof PLAYSTYLES)[number])) {
    return { error: "Select a valid playstyle." };
  }

  return {
    data: {
      email,
      player_name: playerName || null,
      favorite_mmorpg: favoriteMmorpg,
      playstyle,
      alpha_testing: alphaTesting
    }
  };
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "Server configuration is incomplete."
      },
      { status: 500 }
    );
  }

  const body = (await request.json()) as WaitlistPayload;
  const validated = validatePayload(body);

  if ("error" in validated) {
    return NextResponse.json(
      {
        ok: false,
        error: validated.error
      },
      { status: 400 }
    );
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/waitlist_signups`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: "return=representation"
    },
    body: JSON.stringify(validated.data)
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as
      | { code?: string; message?: string }
      | null;

    if (error?.code === "23505") {
      return NextResponse.json(
        {
          ok: false,
          error: "This email is already on the waitlist.",
          code: "already_exists"
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? "Unable to save your signup right now."
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true
  });
}
