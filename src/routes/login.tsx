import { FormEvent, useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
  component: LoginRoute,
});

function LoginRoute() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && session?.user) {
      navigate({ to: "/", replace: true });
    }
  }, [isPending, navigate, session]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "signup") {
        const res = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0] || "Lover",
        });

        if (res.error) {
          setError(res.error.message || "Unable to create account");
          return;
        }
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) {
          setError(res.error.message || "Invalid email or password");
          return;
        }
      }

      navigate({ to: "/", replace: true });
    } catch (unknownError) {
      const message = unknownError instanceof Error ? unknownError.message : "Request failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-sunset px-4">
      <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white/90 p-6 shadow-sm backdrop-blur">
        <h1 className="text-2xl font-semibold text-slate-900">Welcome to Walk of Love</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create your account first, then sign in to see your private space.
        </p>

        <div className="mt-5 grid grid-cols-2 rounded-xl bg-rose-50 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-lg px-3 py-2 ${
              mode === "signup" ? "bg-white font-medium text-rose-700 shadow-sm" : "text-rose-600"
            }`}
          >
            Create account
          </button>
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`rounded-lg px-3 py-2 ${
              mode === "signin" ? "bg-white font-medium text-rose-700 shadow-sm" : "text-rose-600"
            }`}
          >
            Sign in
          </button>
        </div>

        <form className="mt-5 space-y-3" onSubmit={onSubmit}>
          {mode === "signup" ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
            />
          ) : null}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-18 text-sm outline-none focus:border-rose-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error ? <p className="text-sm text-rose-700">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Please wait..."
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
