import { Hono } from "hono";
import { getAuth, requireAuth } from "../lib/auth";
import type { ApiEnv } from "../types";

type MemoryRow = {
  memory_id: string;
  relationship_id: string;
  author_user_id: string;
  title: string;
  story: string;
  memory_date: string;
  memory_type: string;
  location_name: string | null;
  created_at: string;
  updated_at: string;
};

const memoriesRoute = new Hono<ApiEnv>();

memoriesRoute.use("*", requireAuth);

memoriesRoute.get("/", async (c) => {
  const db = c.env.DB;
  if (!db) {
    return c.json({ error: "D1 binding DB is not configured" }, 503);
  }

  const auth = getAuth(c);
  const relationshipId = auth.relationshipId;

  const query = c.req.query("limit");
  const parsed = Number.parseInt(query ?? "20", 10);
  const limit = Number.isNaN(parsed) ? 20 : Math.min(Math.max(parsed, 1), 100);

  const rows = await db
    .prepare(
      `SELECT memory_id, relationship_id, author_user_id, title, story, memory_date, memory_type, location_name, created_at, updated_at
       FROM memories
       WHERE relationship_id = ?
       ORDER BY memory_date DESC, created_at DESC
       LIMIT ?`,
    )
    .bind(relationshipId, limit)
    .all<MemoryRow>();

  return c.json({ items: rows.results ?? [] });
});

memoriesRoute.post("/", async (c) => {
  const db = c.env.DB;
  if (!db) {
    return c.json({ error: "D1 binding DB is not configured" }, 503);
  }

  let payload: {
    title?: unknown;
    story?: unknown;
    memoryDate?: unknown;
    memoryType?: unknown;
    locationName?: unknown;
  };

  try {
    payload = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON payload" }, 400);
  }

  const auth = getAuth(c);
  const relationshipId = auth.relationshipId;
  const authorUserId = auth.userId;
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const story = typeof payload.story === "string" ? payload.story.trim() : "";
  const memoryDate = typeof payload.memoryDate === "string" ? payload.memoryDate.trim() : "";
  const memoryType = typeof payload.memoryType === "string" ? payload.memoryType.trim() : "moment";
  const locationName = typeof payload.locationName === "string" ? payload.locationName.trim() : null;

  if (!title || !story || !memoryDate) {
    return c.json(
      {
        error: "Validation failed",
        details: "title, story, and memoryDate are required",
      },
      422,
    );
  }

  const memoryId = crypto.randomUUID();

  await db
    .prepare(
      `INSERT INTO memories (
        memory_id, relationship_id, author_user_id, title, story, memory_date, memory_type, location_name, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`,
    )
    .bind(memoryId, relationshipId, authorUserId, title, story, memoryDate, memoryType, locationName)
    .run();

  return c.json({ ok: true, memoryId }, 201);
});

export { memoriesRoute };
