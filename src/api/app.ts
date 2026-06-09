import { Hono } from "hono";
import { authRoute } from "./routes/auth";
import { mediaRoute } from "./routes/media";
import { memoriesRoute } from "./routes/memories";
import type { ApiEnv } from "./types";

type ReplyRow = {
  id: string;
  mood: string;
  word: string;
  created_at: string;
};

const app = new Hono<ApiEnv>();

app.route("/api/auth", authRoute);
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
