import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthGate } from "@/components/AuthGate";
import { authClient } from "@/lib/auth-client";
import { storeFingerprint, useFingerprint } from "@/hooks/use-fingerprint";
import type { FingerprintData } from "@/lib/fingerprint";
import { FINGERPRINT_ENABLED } from "@/lib/fingerprint";
import heroImg from "@/assets/couple-hero.jpg";

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
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Couple at golden hour"
            className="h-full w-full object-cover blur-sm"
          />
          <div className="absolute inset-0 bg-linear-to-b from-white/35 via-rose-100/20 to-fuchsia-200/35" />
        </div>

        <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/45 bg-white/28 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.2)] backdrop-blur-xl backdrop-saturate-150">
          <h1 className="text-2xl font-semibold text-slate-900">Your profile</h1>
          <p className="mt-1 text-sm text-slate-600">Account details for this private space.</p>

          <div className="mt-6 space-y-3 rounded-2xl border border-white/45 bg-white/24 p-4 backdrop-blur-md">
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

          {FINGERPRINT_ENABLED ? (
            <FingerprintSection />
          ) : (
            <div className="mt-4 rounded-2xl border border-white/45 bg-white/24 p-4 backdrop-blur-md">
              <p className="text-xs uppercase tracking-wide text-slate-500">Device fingerprint</p>
              <p className="mt-1 text-sm text-slate-700">
                Not configured. Set VITE_FINGERPRINT_API_KEY and restart the dev server.
              </p>
            </div>
          )}

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
                  className="rounded-xl border border-white/60 bg-white/35 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white/50 disabled:opacity-50"
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
                  className="rounded-xl border border-white/60 bg-white/35 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white/50"
                >
                  Edit profile
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/", replace: true })}
                  className="rounded-xl border border-white/60 bg-white/35 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white/50"
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

function FingerprintSection() {
  const {
    isLoading: isFingerprintLoading,
    error: fingerprintError,
    data: fingerprintData,
    visitorId,
    reload: reloadFingerprint,
  } = useFingerprint();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copyError, setCopyError] = useState("");
  const [enrichedData, setEnrichedData] = useState<FingerprintData | null>(null);
  const [enrichmentMessage, setEnrichmentMessage] = useState("");

  useEffect(() => {
    if (fingerprintData) {
      storeFingerprint(fingerprintData);
    }
  }, [fingerprintData]);

  const eventId =
    (fingerprintData?.event_id as string | undefined) ||
    (fingerprintData?.eventId as string | undefined) ||
    null;

  useEffect(() => {
    if (!eventId) {
      setEnrichedData(null);
      setEnrichmentMessage("");
      return;
    }

    let cancelled = false;
    const currentEventId = eventId;

    async function loadEventDetails() {
      try {
        const response = await fetch(
          `/api/fingerprint/event/${encodeURIComponent(currentEventId)}`,
        );
        if (!response.ok) {
          if (response.status === 503) {
            setEnrichmentMessage(
              "Server enrichment is not configured yet (missing Fingerprint server key).",
            );
          } else {
            setEnrichmentMessage("Could not load server-enriched fingerprint details.");
          }
          return;
        }

        const payload = (await response.json()) as { event?: FingerprintData };
        if (!cancelled && payload.event) {
          setEnrichedData(payload.event);
          setEnrichmentMessage("");
        }
      } catch (error) {
        console.error("Failed to enrich fingerprint event:", error);
        if (!cancelled) {
          setEnrichmentMessage("Could not load server-enriched fingerprint details.");
        }
      }
    }

    void loadEventDetails();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const localMeta = getLocalClientMetadata();
  const deviceType = inferDeviceType(fingerprintData);
  const language = typeof navigator !== "undefined" ? navigator.language : "-";
  const timezone =
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "-";
  const screenSize =
    typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "-";
  const browserName =
    enrichedData?.browser_details?.browser_name ||
    fingerprintData?.browser_details?.browser_name ||
    localMeta.browserName ||
    "N/A";
  const browserVersion =
    enrichedData?.browser_details?.browser_version ||
    fingerprintData?.browser_details?.browser_version ||
    localMeta.browserVersion ||
    "N/A";
  const operatingSystem =
    enrichedData?.browser_details?.os ||
    fingerprintData?.browser_details?.os ||
    localMeta.os ||
    "N/A";
  const platform =
    enrichedData?.browser_details?.platform ||
    fingerprintData?.browser_details?.platform ||
    localMeta.platform ||
    "N/A";
  const ipAddress = enrichedData?.ip_address || fingerprintData?.ip_address || "N/A";
  const confidenceScore =
    typeof enrichedData?.confidence?.score === "number"
      ? `${Math.round(enrichedData.confidence.score * 100)}%`
      : typeof fingerprintData?.confidence?.score === "number"
        ? `${Math.round(fingerprintData.confidence.score * 100)}%`
        : "N/A";
  const identifiedAt = enrichedData?.timestamp
    ? new Date(enrichedData.timestamp).toLocaleString()
    : fingerprintData?.timestamp
      ? new Date(fingerprintData.timestamp).toLocaleString()
      : visitorId
        ? "Just now"
        : "N/A";

  useEffect(() => {
    if (!copiedField) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopiedField(null);
    }, 1800);

    return () => window.clearTimeout(timeoutId);
  }, [copiedField]);

  async function copyToClipboard(value: string, label: string) {
    if (!value || value === "N/A" || value === "Identifying...") {
      return;
    }

    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        setCopyError("Clipboard is not available in this browser.");
        return;
      }

      await navigator.clipboard.writeText(value);
      setCopyError("");
      setCopiedField(label);
    } catch (error) {
      console.error("Failed to copy value:", error);
      setCopyError(`Could not copy ${label}.`);
    }
  }

  const fingerprintId = isFingerprintLoading ? "Identifying..." : visitorId || "N/A";
  const browserAndVersion = `${browserName}${browserVersion !== "N/A" ? ` ${browserVersion}` : ""}`;
  const essentials = [
    `Fingerprint ID: ${fingerprintId}`,
    `IP: ${ipAddress}`,
    `Browser: ${browserAndVersion || "N/A"}`,
    `OS: ${operatingSystem}`,
    `Platform: ${platform}`,
  ].join("\n");

  return (
    <div className="mt-4 space-y-3 rounded-2xl border border-white/45 bg-white/24 p-4 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Device fingerprint</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-sm font-medium text-slate-900">{fingerprintId}</p>
            <button
              type="button"
              onClick={() => copyToClipboard(fingerprintId, "Fingerprint ID")}
              disabled={fingerprintId === "N/A" || fingerprintId === "Identifying..."}
              className="rounded-md border border-white/60 bg-white/30 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Copy
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => copyToClipboard(essentials, "Essentials")}
            className="rounded-lg border border-white/60 bg-white/35 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white/50"
          >
            Copy essentials
          </button>
          <button
            type="button"
            onClick={reloadFingerprint}
            className="rounded-lg border border-white/60 bg-white/35 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-white/50"
          >
            Refresh
          </button>
        </div>
      </div>

      {fingerprintError && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {fingerprintError.message}
        </div>
      )}

      {enrichmentMessage && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {enrichmentMessage}
        </div>
      )}

      {copyError && <p className="text-xs text-amber-700">{copyError}</p>}

      {copiedField && <p className="text-xs text-emerald-700">Copied {copiedField}</p>}

      <div className="grid gap-3 rounded-xl border border-white/45 bg-white/20 p-3 text-sm text-slate-700 backdrop-blur-md sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Device type</p>
          <p className="mt-1 font-medium text-slate-900">{deviceType}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Browser</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="font-medium text-slate-900">{browserName}</p>
            <button
              type="button"
              onClick={() => copyToClipboard(browserAndVersion || "N/A", "Browser")}
              disabled={browserName === "N/A"}
              className="rounded-md border border-white/60 bg-white/30 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Copy
            </button>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Version</p>
          <p className="mt-1 font-medium text-slate-900">{browserVersion}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">OS</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="font-medium text-slate-900">{operatingSystem}</p>
            <button
              type="button"
              onClick={() => copyToClipboard(operatingSystem, "OS")}
              disabled={operatingSystem === "N/A"}
              className="rounded-md border border-white/60 bg-white/30 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Copy
            </button>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Platform</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="font-medium text-slate-900">{platform}</p>
            <button
              type="button"
              onClick={() => copyToClipboard(platform, "Platform")}
              disabled={platform === "N/A"}
              className="rounded-md border border-white/60 bg-white/30 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Copy
            </button>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Language</p>
          <p className="mt-1 font-medium text-slate-900">{language || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Time zone</p>
          <p className="mt-1 font-medium text-slate-900">{timezone || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Screen</p>
          <p className="mt-1 font-medium text-slate-900">{screenSize || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">IP address</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="font-medium text-slate-900">{ipAddress}</p>
            <button
              type="button"
              onClick={() => copyToClipboard(ipAddress, "IP address")}
              disabled={ipAddress === "N/A"}
              className="rounded-md border border-white/60 bg-white/30 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-white/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Copy
            </button>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Confidence</p>
          <p className="mt-1 font-medium text-slate-900">{confidenceScore}</p>
        </div>
      </div>

      <p className="text-xs text-slate-500">Last identified: {identifiedAt}</p>
    </div>
  );
}

function inferDeviceType(fingerprintData: FingerprintData | null): string {
  const platformInfo =
    `${fingerprintData?.browser_details?.platform || ""} ${fingerprintData?.browser_details?.os || ""}`.toLowerCase();
  if (/(iphone|android.+mobile|mobile|phone)/.test(platformInfo)) {
    return "Phone";
  }
  if (/(ipad|tablet)/.test(platformInfo)) {
    return "Tablet";
  }

  if (typeof navigator !== "undefined") {
    const ua = navigator.userAgent.toLowerCase();
    const isTablet =
      /ipad|tablet/.test(ua) || (/macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    if (isTablet) {
      return "Tablet";
    }
    if (/iphone|android.+mobile|mobile/.test(ua)) {
      return "Phone";
    }
  }

  return "Desktop/Laptop";
}

function getLocalClientMetadata(): {
  browserName: string | null;
  browserVersion: string | null;
  os: string | null;
  platform: string | null;
} {
  if (typeof navigator === "undefined") {
    return { browserName: null, browserVersion: null, os: null, platform: null };
  }

  const ua = navigator.userAgent;
  const uaLower = ua.toLowerCase();

  let browserName: string | null = null;
  let browserVersion: string | null = null;

  const browserMatchers: Array<{ name: string; regex: RegExp }> = [
    { name: "Edge", regex: /edg\/([\d.]+)/i },
    { name: "Chrome", regex: /chrome\/([\d.]+)/i },
    { name: "Firefox", regex: /firefox\/([\d.]+)/i },
    { name: "Safari", regex: /version\/([\d.]+).*safari/i },
    { name: "Opera", regex: /opr\/([\d.]+)/i },
  ];

  for (const matcher of browserMatchers) {
    const match = ua.match(matcher.regex);
    if (match) {
      browserName = matcher.name;
      browserVersion = match[1] || null;
      break;
    }
  }

  let os: string | null = null;
  if (uaLower.includes("windows")) os = "Windows";
  else if (uaLower.includes("android")) os = "Android";
  else if (uaLower.includes("iphone") || uaLower.includes("ipad")) os = "iOS";
  else if (uaLower.includes("mac os")) os = "macOS";
  else if (uaLower.includes("linux")) os = "Linux";

  const platform = navigator.platform || null;

  return {
    browserName,
    browserVersion,
    os,
    platform,
  };
}
