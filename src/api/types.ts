export type ApiEnv = {
  Bindings: {
    DB?: D1Database;
    MEDIA?: R2Bucket;
    BETTER_AUTH_SECRET?: string;
    BETTER_AUTH_URL?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
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
