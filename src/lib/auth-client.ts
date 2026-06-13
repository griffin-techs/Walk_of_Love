import { createAuthClient } from "better-auth/react";

function resolveAuthBaseURL(): string {
  const configured = import.meta.env.VITE_AUTH_BASE_URL?.trim();
  if (configured) return configured;

  if (typeof window !== "undefined") {
    return new URL("/api/auth", window.location.origin).toString();
  }

  return "http://localhost/api/auth";
}

const authBaseURL = resolveAuthBaseURL();

export const authClient = createAuthClient({
  baseURL: authBaseURL,
  fetchOptions: {
    credentials: "include",
  },
});
