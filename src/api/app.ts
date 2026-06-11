import { Hono } from "hono";
import { cors } from "hono/cors";
import { mediaRoute } from "./routes/media";
import { memoriesRoute } from "./routes/memories";
import { createAuth } from "@/lib/auth";
import type { ApiEnv } from "./types";

type ReplyRow = {
  id: string;
  mood: string;
  word: string;
  created_at: string;
};

type FingerprintEnrichedResponse = {
  event_id: string;
  visitor_id: string | null;
  ip_address: string | null;
  timestamp: string | null;
  confidence: {
    score: number | null;
  };
  browser_details: {
    browser_name: string | null;
    browser_version: string | null;
    os: string | null;
    platform: string | null;
  };
};

const app = new Hono<ApiEnv>();
let authSchemaReady: Promise<void> | null = null;

function readPath(obj: unknown, path: string[]): unknown {
  let current: unknown = obj;
  for (const key of path) {
    if (current == null || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function regionToBaseUrl(region: string | undefined): string {
  if (region === "eu") return "https://eu.api.fpjs.io";
  if (region === "ap") return "https://ap.api.fpjs.io";
  return "https://api.fpjs.io";
}

function normalizeFingerprintEvent(
  payload: unknown,
  fallbackEventId: string,
): FingerprintEnrichedResponse {
  const eventId =
    asString(readPath(payload, ["event", "id"])) ||
    asString(readPath(payload, ["event_id"])) ||
    fallbackEventId;

  const visitorId =
    asString(readPath(payload, ["products", "identification", "data", "visitorId"])) ||
    asString(readPath(payload, ["products", "identification", "data", "visitor_id"])) ||
    null;

  const ipAddress =
    asString(readPath(payload, ["products", "identification", "data", "ip"])) ||
    asString(readPath(payload, ["products", "identification", "data", "ipAddress"])) ||
    asString(readPath(payload, ["products", "identification", "data", "ip_address"])) ||
    null;

  const confidenceScore =
    asNumber(readPath(payload, ["products", "identification", "data", "confidence", "score"])) ||
    asNumber(readPath(payload, ["products", "identification", "data", "confidence", "Score"])) ||
    null;

  const browserName =
    asString(
      readPath(payload, ["products", "identification", "data", "browserDetails", "browserName"]),
    ) ||
    asString(
      readPath(payload, ["products", "identification", "data", "browser_details", "browser_name"]),
    ) ||
    null;

  const browserVersion =
    asString(
      readPath(payload, ["products", "identification", "data", "browserDetails", "browserVersion"]),
    ) ||
    asString(
      readPath(payload, [
        "products",
        "identification",
        "data",
        "browser_details",
        "browser_version",
      ]),
    ) ||
    null;

  const os =
    asString(readPath(payload, ["products", "identification", "data", "browserDetails", "os"])) ||
    asString(readPath(payload, ["products", "identification", "data", "browser_details", "os"])) ||
    null;

  const platform =
    asString(
      readPath(payload, ["products", "identification", "data", "browserDetails", "platform"]),
    ) ||
    asString(
      readPath(payload, ["products", "identification", "data", "browser_details", "platform"]),
    ) ||
    null;

  const timestamp =
    asString(readPath(payload, ["products", "identification", "data", "timestamp"])) ||
    asString(readPath(payload, ["products", "identification", "data", "time"])) ||
    null;

  return {
    event_id: eventId,
    visitor_id: visitorId,
    ip_address: ipAddress,
    timestamp,
    confidence: {
      score: confidenceScore,
    },
    browser_details: {
      browser_name: browserName,
      browser_version: browserVersion,
      os,
      platform,
    },
  };
}

async function ensureBetterAuthSchema(db: ApiEnv["Bindings"]["DB"]): Promise<void> {
  if (!db) {
    return;
  }

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS "user" (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        emailVerified INTEGER NOT NULL DEFAULT 0,
        name TEXT NOT NULL,
        image TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )`,
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS session (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expiresAt TEXT NOT NULL,
        ipAddress TEXT,
        userAgent TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES "user"(id)
      )`,
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS account (
        id TEXT PRIMARY KEY,
        accountId TEXT NOT NULL,
        providerId TEXT NOT NULL,
        userId TEXT NOT NULL,
        accessToken TEXT,
        refreshToken TEXT,
        idToken TEXT,
        accessTokenExpiresAt TEXT,
        refreshTokenExpiresAt TEXT,
        scope TEXT,
        password TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES "user"(id)
      )`,
    )
    .run();

  await db
    .prepare(
      `CREATE UNIQUE INDEX IF NOT EXISTS account_provider_idx
       ON account (providerId, accountId)`,
    )
    .run();

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS verification (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        expiresAt TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )`,
    )
    .run();

  await db
    .prepare(
      `CREATE INDEX IF NOT EXISTS verification_identifier_idx
       ON verification (identifier)`,
    )
    .run();
}

const AUTH_ALLOWED_ORIGINS = new Set([
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

app.use(
  "/api/auth/*",
  cors({
    origin: (origin) => (origin && AUTH_ALLOWED_ORIGINS.has(origin) ? origin : ""),
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.all("/api/auth/*", async (c) => {
  if (!c.env.DB) {
    return c.json({ error: "D1 binding DB is not configured" }, 503);
  }

  if (!authSchemaReady) {
    authSchemaReady = ensureBetterAuthSchema(c.env.DB);
  }

  await authSchemaReady;
  const auth = createAuth(c.env);
  return auth.handler(c.req.raw);
});
app.route("/api/media", mediaRoute);
app.route("/api/memories", memoriesRoute);

app.get("/api/fingerprint/event/:eventId", async (c) => {
  const eventId = c.req.param("eventId")?.trim();
  if (!eventId) {
    return c.json({ error: "eventId is required" }, 422);
  }

  const secretApiKey = c.env.FINGERPRINT_SECRET_API_KEY;
  if (!secretApiKey) {
    return c.json({ error: "FINGERPRINT_SECRET_API_KEY is not configured" }, 503);
  }

  const explicitBase = c.env.FINGERPRINT_SERVER_BASE_URL?.trim();
  const baseUrl = explicitBase || regionToBaseUrl(c.env.FINGERPRINT_SERVER_REGION);
  const endpoint = `${baseUrl.replace(/\/$/, "")}/events/${encodeURIComponent(eventId)}`;

  const upstream = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Auth-API-Key": secretApiKey,
      Accept: "application/json",
    },
  });

  if (!upstream.ok) {
    const details = await upstream.text();
    return c.json(
      {
        error: "Failed to fetch Fingerprint event",
        status: upstream.status,
        details,
      },
      { status: upstream.status as 400 | 401 | 403 | 404 | 409 | 410 | 422 | 429 | 500 | 503 },
    );
  }

  const payload = await upstream.json();
  const enriched = normalizeFingerprintEvent(payload, eventId);
  return c.json({ ok: true, event: enriched });
});

app.get("/api/health", (c) => {
  return c.json({ ok: true, service: "walkoflove-api" });
});

app.get("/api/replies", async (c) => {
  const db = c.env.DB;
  if (!db) {
    return c.json({ error: "D1 binding DB is not configured" }, 503);
  }

  const query = c.req.query("limit");
  const parsed = Number.parseInt(query ?? "20", 10);
  const limit = Number.isNaN(parsed) ? 20 : Math.min(Math.max(parsed, 1), 100);

  const rows = await db
    .prepare(
      "SELECT id, mood, word, created_at FROM sheila_replies ORDER BY created_at DESC LIMIT ?",
    )
    .bind(limit)
    .all<ReplyRow>();

  return c.json({ items: rows.results ?? [] });
});

app.post("/api/replies", async (c) => {
  const db = c.env.DB;
  if (!db) {
    return c.json({ error: "D1 binding DB is not configured" }, 503);
  }

  let payload: { mood?: unknown; word?: unknown };
  try {
    payload = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON payload" }, 400);
  }

  const mood = typeof payload.mood === "string" ? payload.mood.trim() : "";
  const word = typeof payload.word === "string" ? payload.word.trim() : "";

  if (!mood || mood.length > 16 || !word || word.length > 60) {
    return c.json(
      {
        error: "Validation failed",
        details: "mood must be 1-16 chars, word must be 1-60 chars",
      },
      422,
    );
  }

  const id = crypto.randomUUID();

  await db
    .prepare(
      "INSERT INTO sheila_replies (id, mood, word, created_at) VALUES (?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))",
    )
    .bind(id, mood, word)
    .run();

  return c.json({ ok: true, id }, 201);
});

export { app };
