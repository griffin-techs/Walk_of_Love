import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthGate } from "@/components/AuthGate";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/profile")({
  component: ProfileRoute,
});

function ProfileRoute() {
  const navigate = useNavigate();
  const { data: session, refetch } = authClient.useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpdateProfile() {
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await authClient.updateUser({
        name: name.trim(),
      });

      if (result.error) {
        setError(result.error.message || "Failed to update profile");
      } else {
        await refetch();
        setIsEditing(false);
      }
    } catch (err) {
      setError("An error occurred while updating your profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await authClient.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <AuthGate>
      <main className="flex min-h-screen items-center justify-center bg-gradient-sunset px-4">
        <div className="w-full max-w-xl rounded-3xl border border-rose-200 bg-white/90 p-6 shadow-sm backdrop-blur">
          <h1 className="text-2xl font-semibold text-slate-900">Your profile</h1>
          <p className="mt-1 text-sm text-slate-600">Account details for this private space.</p>

          <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Enter your name"
                />
              ) : (
                <p className="text-sm font-medium text-slate-900">{session?.user?.name || "-"}</p>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
              <p className="text-sm font-medium text-slate-900">{session?.user?.email || "-"}</p>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setName(session?.user?.name || "");
                    setError("");
                  }}
                  disabled={loading}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/", replace: true })}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Back home
                </button>
                <button
                  type="button"
                  onClick={signOut}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </AuthGate>
  );
}
