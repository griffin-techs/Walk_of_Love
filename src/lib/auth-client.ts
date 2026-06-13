import { createAuthClient } from "better-auth/react";

const authBaseURL =
	import.meta.env.VITE_AUTH_BASE_URL?.trim() || "http://localhost:8787/api/auth";

export const authClient = createAuthClient({
	baseURL: authBaseURL,
	fetchOptions: {
		credentials: "include",
	},
});
