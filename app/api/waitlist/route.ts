import { createHash, randomUUID } from "crypto";

import { NextResponse } from "next/server";

const PLAYSTYLES = ["PvP", "PvE", "Exploration", "Crafting", "Raids"] as const;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const RATE_LIMIT_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

type WaitlistPayload = {
  email?: string;
  playerName?: string;
  favoriteMmorpg?: string;
  playstyle?: string;
  alphaTesting?: string;
  website?: string;
  turnstileToken?: string;
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

function buildSupabaseHeaders(key: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: key,
    Prefer: "return=representation"
  };

  // Legacy anon/service_role keys are JWTs and can be used as Bearer tokens.
  // New publishable/secret keys are not JWTs and should not be sent in Authorization.
  if (key.split(".").length === 3) {
    headers.Authorization = `Bearer ${key}`;
  }

  return headers;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return (
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    forwardedFor ??
    null
  );
}

function hashIp(ip: string, salt: string) {
  return createHash("sha256")
    .update(`${salt}:${ip}`)
    .digest("hex");
}

async function isRateLimited(supabaseUrl: string, supabaseKey: string, ipHash: string) {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const query = new URLSearchParams({
    select: "id",
    request_ip_hash: `eq.${ipHash}`,
    created_at: `gte.${since}`,
    order: "created_at.desc",
    limit: String(RATE_LIMIT_MAX_ATTEMPTS)
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/waitlist_request_log?${query.toString()}`, {
    method: "GET",
    headers: buildSupabaseHeaders(supabaseKey),
    cache: "no-store"
  });

  if (!response.ok) {
    return false;
  }

  const rows = (await response.json()) as Array<{ id: number }>;
  return rows.length >= RATE_LIMIT_MAX_ATTEMPTS;
}

async function logAttempt(supabaseUrl: string, supabaseKey: string, ipHash: string) {
  await fetch(`${supabaseUrl}/rest/v1/waitlist_request_log`, {
    method: "POST",
    headers: buildSupabaseHeaders(supabaseKey),
    body: JSON.stringify({ request_ip_hash: ipHash })
  });
}

async function cleanupRateLimitLog(supabaseUrl: string, supabaseKey: string) {
  const cutoff = new Date(Date.now() - RATE_LIMIT_RETENTION_MS).toISOString();
  const query = new URLSearchParams({
    created_at: `lt.${cutoff}`
  });

  await fetch(`${supabaseUrl}/rest/v1/waitlist_request_log?${query.toString()}`, {
    method: "DELETE",
    headers: buildSupabaseHeaders(supabaseKey)
  });
}

async function verifyTurnstileToken({
  secret,
  token,
  ip,
  expectedHostname
}: {
  secret: string;
  token: string;
  ip: string | null;
  expectedHostname: string;
}) {
  const payload = new URLSearchParams({
    secret,
    response: token,
    idempotency_key: randomUUID()
  });

  if (ip) {
    payload.set("remoteip", ip);
  }

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: payload.toString(),
    cache: "no-store"
  });

  if (!response.ok) {
    return { success: false };
  }

  const data = (await response.json()) as {
    success?: boolean;
    hostname?: string;
  };

  if (!data.success) {
    return { success: false };
  }

  if (data.hostname && data.hostname !== expectedHostname) {
    return { success: false };
  }

  return { success: true };
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVER_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  const turnstileSecret =
    process.env.TURNSTILE_SECRET_KEY ?? process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "Server configuration is incomplete. Add SUPABASE_URL and SUPABASE_SECRET_KEY to the server environment."
      },
      { status: 500 }
    );
  }

  const body = (await request.json()) as WaitlistPayload;

  if (body.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

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

  const clientIp = getClientIp(request);

  if (process.env.NODE_ENV !== "development" && clientIp) {
    const ipHash = hashIp(clientIp, process.env.RATE_LIMIT_SALT ?? supabaseKey);

    if (await isRateLimited(supabaseUrl, supabaseKey, ipHash)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Too many waitlist attempts from this connection. Please wait a few minutes and try again."
        },
        { status: 429 }
      );
    }

    await logAttempt(supabaseUrl, supabaseKey, ipHash);

    if (Math.random() < 0.05) {
      void cleanupRateLimitLog(supabaseUrl, supabaseKey);
    }
  }

  if (turnstileSecret) {
    const token = body.turnstileToken?.trim();

    if (!token) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please complete the CAPTCHA challenge."
        },
        { status: 400 }
      );
    }

    const expectedHostname = new URL(request.url).hostname;
    const verification = await verifyTurnstileToken({
      secret: turnstileSecret,
      token,
      ip: clientIp,
      expectedHostname
    });

    if (!verification.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "CAPTCHA verification failed. Please try again."
        },
        { status: 400 }
      );
    }
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/waitlist_signups`, {
    method: "POST",
    headers: buildSupabaseHeaders(supabaseKey),
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
