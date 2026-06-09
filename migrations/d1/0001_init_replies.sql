CREATE TABLE IF NOT EXISTS sheila_replies (
  id TEXT PRIMARY KEY,
  mood TEXT NOT NULL,
  word TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CHECK (length(mood) <= 16),
  CHECK (length(word) > 0 AND length(word) <= 60)
);

CREATE INDEX IF NOT EXISTS idx_sheila_replies_created_at
  ON sheila_replies (created_at DESC);
