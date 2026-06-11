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

const app = new Hono<ApiEnv>();
let authSchemaReady: Promise<void> | null = null;

async function ensureBetterAuthSchema(db: D1Database): Promise<void> {
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

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  if (!c.env.DB) {
    return c.json({ error: "D1 binding DB is not configured" }, 503);
  }

  if (!authSchemaReady) {
    authSchemaReady = ensureBetterAuthSchema(c.env.DB);
  }

  return authSchemaReady.then(() => {
    const auth = createAuth(c.env);
    return auth.handler(c.req.raw);
  });
});
app.route("/api/media", mediaRoute);
app.route("/api/memories", memoriesRoute);

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
