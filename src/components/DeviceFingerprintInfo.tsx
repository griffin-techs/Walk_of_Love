/**
 * Device Fingerprint Display Component
 * Shows visitor identification and device details
 */

import { useFingerprint, storeFingerprint } from "@/hooks/use-fingerprint";
import { useEffect } from "react";

export function DeviceFingerprintInfo() {
  const { isLoading, error, data, visitorId, reload } = useFingerprint();

  // Store fingerprint when data loads
  useEffect(() => {
    if (data) {
      storeFingerprint(data);
    }
  }, [data]);

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Device Identification
      </h3>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
          Identifying device...
        </div>
      )}

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <p className="font-medium">Error identifying device</p>
          <p className="mt-1 text-xs opacity-75">{error.message}</p>
          <p className="mt-2 text-xs">
            Note: Fingerprint API key may not be configured. Set{" "}
            <code className="rounded bg-destructive/20 px-1 font-mono">
              VITE_FINGERPRINT_API_KEY
            </code>{" "}
            in your .env file.
          </p>
        </div>
      )}

      {data && !isLoading && !error && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium uppercase text-muted-foreground">
              Visitor ID (Device Fingerprint)
            </label>
            <p className="mt-1 break-all font-mono text-sm text-foreground">
              {visitorId}
            </p>
          </div>

          {data.confidence && (
            <div>
              <label className="text-xs font-medium uppercase text-muted-foreground">
                Confidence Score
              </label>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-2 flex-1 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{
                      width: `${(data.confidence.score || 0) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {Math.round((data.confidence.score || 0) * 100)}%
                </span>
              </div>
            </div>
          )}

          {data.browser_details && (
            <div className="grid gap-3 rounded-md bg-muted/30 p-3 text-sm">
              <div>
                <span className="text-xs text-muted-foreground">Browser</span>
                <p className="text-foreground">
                  {data.browser_details.browser_name}{" "}
                  {data.browser_details.browser_version}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">OS</span>
                <p className="text-foreground">{data.browser_details.os}</p>
              </div>
            </div>
          )}

          {data.timestamp && (
            <div>
              <label className="text-xs font-medium uppercase text-muted-foreground">
                Identified at
              </label>
              <p className="mt-1 text-sm text-foreground">
                {new Date(data.timestamp).toLocaleString()}
              </p>
            </div>
          )}

          <button
            onClick={reload}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Refresh Device ID
          </button>
        </div>
      )}
    </div>
  );
}
