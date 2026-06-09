CREATE TABLE IF NOT EXISTS passkey_credentials (
  credential_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  rp_id TEXT NOT NULL,
  public_key_jwk TEXT NOT NULL,
  sign_count INTEGER NOT NULL DEFAULT 0,
  transports TEXT,
  nickname TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  last_used_at TEXT,
  revoked_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS auth_challenges (
  challenge_id TEXT PRIMARY KEY,
  challenge TEXT NOT NULL,
  challenge_type TEXT NOT NULL,
  user_id TEXT,
  relationship_id TEXT,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CHECK (challenge_type IN ('register', 'login', 'device_approval', 'recovery')),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (relationship_id) REFERENCES relationships(relationship_id)
);

CREATE TABLE IF NOT EXISTS device_approvals (
  approval_id TEXT PRIMARY KEY,
  relationship_id TEXT NOT NULL,
  requester_user_id TEXT NOT NULL,
  requester_device_id TEXT NOT NULL,
  approver_user_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TEXT NOT NULL,
  decided_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CHECK (status IN ('pending', 'approved', 'denied', 'expired')),
  FOREIGN KEY (relationship_id) REFERENCES relationships(relationship_id),
  FOREIGN KEY (requester_user_id) REFERENCES users(user_id),
  FOREIGN KEY (requester_device_id) REFERENCES trusted_devices(device_id),
  FOREIGN KEY (approver_user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS recovery_artifacts (
  recovery_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE INDEX IF NOT EXISTS idx_passkey_credentials_user
  ON passkey_credentials (user_id, revoked_at, last_used_at);

CREATE INDEX IF NOT EXISTS idx_auth_challenges_user
  ON auth_challenges (user_id, challenge_type, expires_at, consumed_at);

CREATE INDEX IF NOT EXISTS idx_auth_challenges_relationship
  ON auth_challenges (relationship_id, challenge_type, expires_at, consumed_at);

CREATE INDEX IF NOT EXISTS idx_device_approvals_pending
  ON device_approvals (relationship_id, status, expires_at);

CREATE INDEX IF NOT EXISTS idx_recovery_artifacts_user
  ON recovery_artifacts (user_id, used_at, expires_at);
