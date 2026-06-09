import { Hono } from "hono";
import {
  clearSessionCookie,
  makeSessionCookie,
  readSessionFromRequest,
  sha256Hex,
} from "../lib/auth";
import type { ApiEnv } from "../types";

type ChallengePayload = {
  challengeId: string;
  challenge: string;
  expiresAt: string;
};

const authRoute = new Hono<ApiEnv>();

authRoute.get("/debug-session", async (c) => {
  const auth = await readSessionFromRequest(c);
  return c.json({
    cookieHeader: c.req.header("cookie") ?? null,
    auth,
  });
});

function plusMinutes(minutes: number): string {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

function plusDays(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60_000).toISOString();
}

function randomBase64Url(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  const binary = String.fromCharCode(...arr);
  const b64 = btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  return b64;
}

authRoute.post("/challenge", async (c) => {
  const db = c.env.DB;
  if (!db) {
    return c.json({ error: "D1 binding DB is not configured" }, 503);
  }

  let payload: { type?: unknown; userId?: unknown; relationshipId?: unknown };
  try {
    payload = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON payload" }, 400);
  }

  const type = typeof payload.type === "string" ? payload.type.trim() : "";
  const userId = typeof payload.userId === "string" ? payload.userId.trim() : null;
  const relationshipId =
    typeof payload.relationshipId === "string" ? payload.relationshipId.trim() : null;

  if (!["register", "login", "device_approval", "recovery"].includes(type)) {
    return c.json({ error: "Invalid challenge type" }, 422);
  }

  const challengeId = crypto.randomUUID();
  const challenge = randomBase64Url(32);
  const expiresAt = plusMinutes(10);

  await db
    .prepare(
      `INSERT INTO auth_challenges (
        challenge_id, challenge, challenge_type, user_id, relationship_id, expires_at, consumed_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, NULL, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`,
    )
    .bind(challengeId, challenge, type, userId, relationshipId, expiresAt)
    .run();

  const response: ChallengePayload = {
    challengeId,
    challenge,
    expiresAt,
  };

  return c.json(response, 201);
});

authRoute.post("/verify", async (c) => {
  const db = c.env.DB;
  if (!db) {
    return c.json({ error: "D1 binding DB is not configured" }, 503);
  }

  let payload: {
    challengeId?: unknown;
    challenge?: unknown;
    userId?: unknown;
    deviceLabel?: unknown;
    deviceFingerprint?: unknown;
  };

  try {
    payload = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON payload" }, 400);
  }

  const challengeId = typeof payload.challengeId === "string" ? payload.challengeId.trim() : "";
  const challenge = typeof payload.challenge === "string" ? payload.challenge.trim() : "";
  const userId = typeof payload.userId === "string" ? payload.userId.trim() : "";
  const deviceLabel =
    typeof payload.deviceLabel === "string" ? payload.deviceLabel.trim() : "Unnamed device";
  const deviceFingerprint =
    typeof payload.deviceFingerprint === "string" ? payload.deviceFingerprint.trim() : "";

  if (!challengeId || !challenge || !userId || !deviceFingerprint) {
    return c.json(
      {
        error: "Validation failed",
        details: "challengeId, challenge, userId, and deviceFingerprint are required",
      },
      422,
    );
  }

  const stored = await db
    .prepare(
      `SELECT challenge_id, challenge, challenge_type, user_id, expires_at, consumed_at
       FROM auth_challenges
       WHERE challenge_id = ?
       LIMIT 1`,
    )
    .bind(challengeId)
    .first<{
      challenge_id: string;
      challenge: string;
      challenge_type: string;
      user_id: string | null;
      expires_at: string;
      consumed_at: string | null;
    }>();

  if (!stored) {
    return c.json({ error: "Challenge not found" }, 404);
  }

  if (stored.consumed_at) {
    return c.json({ error: "Challenge already consumed" }, 409);
  }

  if (Date.parse(stored.expires_at) <= Date.now()) {
    return c.json({ error: "Challenge expired" }, 410);
  }

  if (stored.challenge !== challenge) {
    return c.json({ error: "Challenge mismatch" }, 401);
  }

  if (stored.user_id && stored.user_id !== userId) {
    return c.json({ error: "Challenge user mismatch" }, 401);
  }

  const relationship = await db
    .prepare(
      `SELECT relationship_id
       FROM relationships
       WHERE user_a_id = ? OR user_b_id = ?
       LIMIT 1`,
    )
    .bind(userId, userId)
    .first<{ relationship_id: string }>();

  if (!relationship) {
    return c.json({ error: "User is not bound to a relationship" }, 403);
  }

  const deviceId = crypto.randomUUID();
  const fingerprintHash = await sha256Hex(deviceFingerprint);

  await db
    .prepare(
      `INSERT INTO trusted_devices (
        device_id, user_id, label, fingerprint_hash, approved_at, revoked_at, created_at
      ) VALUES (?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), NULL, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`,
    )
    .bind(deviceId, userId, deviceLabel, fingerprintHash)
    .run();

  const sessionId = crypto.randomUUID();
  const refreshToken = randomBase64Url(48);
  const refreshTokenHash = await sha256Hex(refreshToken);
  const expiresAt = plusDays(14);

  await db
    .prepare(
      `INSERT INTO sessions (
        session_id, user_id, device_id, refresh_token_hash, expires_at, revoked_at, created_at
      ) VALUES (?, ?, ?, ?, ?, NULL, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`,
    )
    .bind(sessionId, userId, deviceId, refreshTokenHash, expiresAt)
    .run();

  await db
    .prepare(
      `UPDATE auth_challenges
       SET consumed_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE challenge_id = ?`,
    )
    .bind(challengeId)
    .run();

  const isHttps = new URL(c.req.url).protocol === "https:";
  c.header("set-cookie", makeSessionCookie(sessionId, expiresAt, { secure: isHttps }));

  return c.json(
    {
      ok: true,
      session: {
        sessionId,
        userId,
        relationshipId: relationship.relationship_id,
        expiresAt,
      },
      refreshToken,
    },
    201,
  );
});

authRoute.post("/logout", async (c) => {
  const db = c.env.DB;
  if (!db) {
    return c.json({ error: "D1 binding DB is not configured" }, 503);
  }

  const cookie = c.req.header("cookie") ?? "";
  const sessionMatch = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("wol_session="));

  if (sessionMatch) {
    const sessionId = decodeURIComponent(sessionMatch.slice("wol_session=".length));
    await db
      .prepare(
        `UPDATE sessions
         SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
         WHERE session_id = ?`,
      )
      .bind(sessionId)
      .run();
  }

  c.header("set-cookie", clearSessionCookie());
  return c.json({ ok: true });
});

export { authRoute };
