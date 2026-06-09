CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CHECK (status IN ('active', 'locked', 'disabled'))
);

CREATE TABLE IF NOT EXISTS relationships (
  relationship_id TEXT PRIMARY KEY,
  user_a_id TEXT NOT NULL,
  user_b_id TEXT NOT NULL,
  started_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CHECK (user_a_id <> user_b_id),
  CHECK (status IN ('active', 'paused', 'archived')),
  FOREIGN KEY (user_a_id) REFERENCES users(user_id),
  FOREIGN KEY (user_b_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS trusted_devices (
  device_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  label TEXT,
  fingerprint_hash TEXT NOT NULL,
  approved_at TEXT,
  revoked_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  refresh_token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  revoked_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (device_id) REFERENCES trusted_devices(device_id)
);

CREATE TABLE IF NOT EXISTS memories (
  memory_id TEXT PRIMARY KEY,
  relationship_id TEXT NOT NULL,
  author_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  memory_date TEXT NOT NULL,
  memory_type TEXT NOT NULL DEFAULT 'moment',
  location_name TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (relationship_id) REFERENCES relationships(relationship_id),
  FOREIGN KEY (author_user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS memory_comments (
  comment_id TEXT PRIMARY KEY,
  memory_id TEXT NOT NULL,
  author_user_id TEXT NOT NULL,
  parent_comment_id TEXT,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (memory_id) REFERENCES memories(memory_id),
  FOREIGN KEY (author_user_id) REFERENCES users(user_id),
  FOREIGN KEY (parent_comment_id) REFERENCES memory_comments(comment_id)
);

CREATE TABLE IF NOT EXISTS memory_reactions (
  reaction_id TEXT PRIMARY KEY,
  memory_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  reaction_type TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (memory_id) REFERENCES memories(memory_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_memory_reactions_one_per_user
  ON memory_reactions (memory_id, user_id);

CREATE INDEX IF NOT EXISTS idx_memories_relationship_date
  ON memories (relationship_id, memory_date DESC);

CREATE INDEX IF NOT EXISTS idx_memories_relationship_created
  ON memories (relationship_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_memory_comments_memory_created
  ON memory_comments (memory_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_sessions_user_revoked
  ON sessions (user_id, revoked_at, expires_at);
