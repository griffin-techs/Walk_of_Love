import type { Context, MiddlewareHandler } from "hono";
import type { ApiEnv, AuthContext } from "../types";

type SessionRow = {
  session_id: string;
  user_id: string;
  device_id: string;
  expires_at: string;
  relationship_id: string;
};

const SESSION_COOKIE = "wol_session";

function parseCookies(raw: string | null): Record<string, string> {
  if (!raw) return {};
  const pairs = raw.split(";");
  const cookies: Record<string, string> = {};

  for (const pair of pairs) {
    const index = pair.indexOf("=");
    if (index === -1) continue;
    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    if (key) cookies[key] = decodeURIComponent(value);
  }

  return cookies;
}

function isExpired(dateIso: string): boolean {
  const expires = Date.parse(dateIso);
  if (Number.isNaN(expires)) return true;
  return Date.now() >= expires;
}

export async function readSessionFromRequest(c: Context<ApiEnv>): Promise<AuthContext | null> {
  const db = c.env.DB;
  if (!db) return null;

  const cookies = parseCookies(c.req.header("cookie") ?? null);
  const sessionId = cookies[SESSION_COOKIE];
  if (!sessionId) return null;

  const row = await db
    .prepare(
      `SELECT s.session_id, s.user_id, s.device_id, s.expires_at, r.relationship_id
       FROM sessions s
       JOIN relationships r ON (r.user_a_id = s.user_id OR r.user_b_id = s.user_id)
       WHERE s.session_id = ? AND s.revoked_at IS NULL
       LIMIT 1`,
    )
    .bind(sessionId)
    .first<SessionRow>();

  if (!row) return null;
  if (isExpired(row.expires_at)) return null;

  return {
    sessionId: row.session_id,
    userId: row.user_id,
    relationshipId: row.relationship_id,
    deviceId: row.device_id,
    expiresAt: row.expires_at,
  };
}

export const requireAuth: MiddlewareHandler<ApiEnv> = async (c, next) => {
  const auth = await readSessionFromRequest(c);
  if (!auth) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("auth", auth);
  await next();
};

export function getAuth(c: Context<ApiEnv>): AuthContext {
  const auth = c.get("auth");
  if (!auth) {
    throw new Error("Auth context missing. Ensure requireAuth middleware is applied.");
  }
  return auth;
}

export function makeSessionCookie(
  sessionId: string,
  expiresAt: string,
  options?: { secure?: boolean; sameSite?: "Strict" | "Lax" | "None" },
): string {
  const expires = new Date(expiresAt).toUTCString();
  const secure = options?.secure ?? true;
  const sameSite = options?.sameSite ?? "Strict";
  const securePart = secure ? "; Secure" : "";
  return `${SESSION_COOKIE}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly${securePart}; SameSite=${sameSite}; Expires=${expires}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
