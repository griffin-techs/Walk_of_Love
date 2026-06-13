import { betterAuth } from "better-auth";
import type { ApiEnv } from "@/api/types";

type AuthBindings = ApiEnv["Bindings"];

function getSocialProviders(env: AuthBindings) {
  const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    socialProviders.github = {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    };
  }

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    socialProviders.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    };
  }

  return Object.keys(socialProviders).length > 0 ? socialProviders : undefined;
}

export function createAuth(env: AuthBindings) {
  const secret = env.BETTER_AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET;
  const baseURL = env.BETTER_AUTH_URL ?? process.env.BETTER_AUTH_URL;

  return betterAuth({
    database: env.DB,
    secret,
    baseURL,
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: getSocialProviders(env),
    trustedOrigins: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:8080",
      "http://127.0.0.1:8080",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:8787",
      "http://127.0.0.1:8787",
    ],
  });
}
