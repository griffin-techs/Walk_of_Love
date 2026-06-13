import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";

export function AuthGate({ children }: { children: React.ReactNode }) {
  if (typeof window === "undefined") {
    return <>{children}</>;
  }

  return <AuthGateClient>{children}</AuthGateClient>;
}

function AuthGateClient({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      navigate({ to: "/login", replace: true });
    }
  }, [isPending, navigate, session]);

  if (isPending || !session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-2xl border border-rose-200 bg-white/80 px-6 py-4 text-sm text-slate-600 shadow-sm">
          Checking your session...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
