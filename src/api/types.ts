export type ApiEnv = {
  Bindings: {
    DB?: D1Database;
    MEDIA?: R2Bucket;
  };
  Variables: {
    auth?: AuthContext;
  };
};

export type AuthContext = {
  sessionId: string;
  userId: string;
  relationshipId: string;
  deviceId: string;
  expiresAt: string;
};
