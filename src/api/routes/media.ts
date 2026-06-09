import { Hono } from "hono";
import { getAuth, requireAuth } from "../lib/auth";
import type { ApiEnv } from "../types";

type UploadUrlPayload = {
  filename?: unknown;
  contentType?: unknown;
};

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const mediaRoute = new Hono<ApiEnv>();

mediaRoute.use("*", requireAuth);

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function makeObjectKey(relationshipId: string, filename: string): string {
  const safe = sanitizeFilename(filename || "upload.bin") || "upload.bin";
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `${relationshipId}_${stamp}_${crypto.randomUUID()}_${safe}`;
}

mediaRoute.post("/upload-url", async (c) => {
  const bucket = c.env.MEDIA;
  if (!bucket) {
    return c.json({ error: "R2 binding MEDIA is not configured" }, 503);
  }

  let payload: UploadUrlPayload;
  try {
    payload = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON payload" }, 400);
  }

  const auth = getAuth(c);
  const filename = typeof payload.filename === "string" ? payload.filename.trim() : "upload.bin";
  const contentType =
    typeof payload.contentType === "string" && payload.contentType.trim()
      ? payload.contentType.trim()
      : "application/octet-stream";

  const key = makeObjectKey(auth.relationshipId, filename);

  return c.json({
    ok: true,
    key,
    method: "PUT",
    maxUploadBytes: MAX_UPLOAD_BYTES,
    uploadUrl: `/api/media/${encodeURIComponent(key)}`,
    publicUrl: `/api/media/${encodeURIComponent(key)}`,
    headers: {
      "content-type": contentType,
    },
  });
});

mediaRoute.put("/:key", async (c) => {
  const bucket = c.env.MEDIA;
  if (!bucket) {
    return c.json({ error: "R2 binding MEDIA is not configured" }, 503);
  }

  const auth = getAuth(c);
  const key = c.req.param("key").trim();
  if (!key || !key.startsWith(`${auth.relationshipId}_`)) {
    return c.json({ error: "Invalid object key" }, 403);
  }

  const contentLength = Number.parseInt(c.req.header("content-length") ?? "0", 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_UPLOAD_BYTES) {
    return c.json({ error: "File too large", maxUploadBytes: MAX_UPLOAD_BYTES }, 413);
  }

  const body = await c.req.arrayBuffer();
  if (!body.byteLength) {
    return c.json({ error: "Request body is empty" }, 400);
  }
  if (body.byteLength > MAX_UPLOAD_BYTES) {
    return c.json({ error: "File too large", maxUploadBytes: MAX_UPLOAD_BYTES }, 413);
  }

  const contentType = c.req.header("content-type") ?? "application/octet-stream";

  await bucket.put(key, body, {
    httpMetadata: {
      contentType,
      cacheControl: "private, max-age=31536000, immutable",
    },
    customMetadata: {
      relationshipId: auth.relationshipId,
      uploadedBy: auth.userId,
    },
  });

  return c.json({ ok: true, key, bytes: body.byteLength }, 201);
});

mediaRoute.get("/:key", async (c) => {
  const bucket = c.env.MEDIA;
  if (!bucket) {
    return c.json({ error: "R2 binding MEDIA is not configured" }, 503);
  }

  const auth = getAuth(c);
  const key = c.req.param("key").trim();
  if (!key) {
    return c.json({ error: "Missing object key" }, 400);
  }

  const object = await bucket.get(key);
  if (!object) {
    return c.json({ error: "Not found" }, 404);
  }

  const ownerRelationshipId = object.customMetadata?.relationshipId;
  if (!ownerRelationshipId || ownerRelationshipId !== auth.relationshipId) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "private, max-age=60");

  return new Response(object.body, { headers });
});

export { mediaRoute };
