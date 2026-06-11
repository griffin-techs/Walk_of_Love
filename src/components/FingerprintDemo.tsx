/**
 * Example: Device Fingerprint Demo
 * Shows how to use the fingerprinting system in your components
 */

"use client";

import { useFingerprint, storeFingerprint } from "@/hooks/use-fingerprint";
import { useEffect, useState } from "react";

export function FingerprintDemo() {
  const { isLoading, error, data, visitorId, reload } = useFingerprint();
  const [copied, setCopied] = useState(false);

  // Automatically store fingerprint when loaded
  useEffect(() => {
    if (data) {
      storeFingerprint(data);
    }
  }, [data]);

  const copyToClipboard = () => {
    if (visitorId) {
      navigator.clipboard.writeText(visitorId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          🔍 Device Fingerprinting
        </h2>
        <p className="mt-2 text-muted-foreground">
          Unique device identification for security and device tracking.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        {isLoading && (
          <div className="space-y-4">
            <div className="h-6 w-48 animate-pulse rounded bg-muted" />
            <div className="h-12 w-full animate-pulse rounded bg-muted" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <h3 className="font-semibold text-destructive">
              ⚠️ Fingerprinting Error
            </h3>
            <p className="mt-2 text-sm text-destructive/80">{error.message}</p>
            <div className="mt-4 rounded bg-background p-3 font-mono text-xs text-muted-foreground">
              <p>To fix this:</p>
              <ol className="mt-2 space-y-1 list-decimal list-inside">
                <li>Get your API key from fingerprint.com</li>
                <li>Add it to .env as VITE_FINGERPRINT_API_KEY</li>
                <li>Set VITE_FINGERPRINT_REGION (us or eu)</li>
                <li>Restart the dev server</li>
              </ol>
            </div>
          </div>
        )}

        {data && !error && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Your Unique Device ID
              </label>
              <div className="mt-3 flex gap-2">
                <code className="flex-1 rounded-lg border border-border bg-muted p-3 font-mono text-xs text-foreground">
                  {visitorId}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>

            {data.confidence && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Confidence Score
                </label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{
                        width: `${(data.confidence.score || 0) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="min-w-12 text-sm font-semibold text-foreground">
                    {Math.round((data.confidence.score || 0) * 100)}%
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  How likely this device ID is unique and accurate.
                </p>
              </div>
            )}

            {data.browser_details && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Device Details
                </label>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {data.browser_details.browser_name && (
                    <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        Browser
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {data.browser_details.browser_name}
                        {data.browser_details.browser_version &&
                          ` ${data.browser_details.browser_version}`}
                      </p>
                    </div>
                  )}
                  {data.browser_details.os && (
                    <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        Operating System
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {data.browser_details.os}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {data.ip_address && (
              <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  IP Address
                </p>
                <p className="mt-1 font-mono text-sm text-foreground">
                  {data.ip_address}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Full Data (JSON)
              </label>
              <pre className="mt-3 max-h-64 overflow-auto rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>

            <button
              onClick={reload}
              className="w-full rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Refresh Device ID
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
        <h3 className="font-semibold text-foreground">💡 Usage Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            • Use{" "}
            <code className="rounded bg-background px-1 font-mono text-xs">
              useFingerprint()
            </code>{" "}
            hook in any component
          </li>
          <li>
            • Store fingerprints with user sessions for security tracking
          </li>
          <li>• Detect unusual device changes or suspicious activity</li>
          <li>
            • Use{" "}
            <code className="rounded bg-background px-1 font-mono text-xs">
              storeFingerprint()
            </code>{" "}
            to cache locally
          </li>
        </ul>
      </div>
    </div>
  );
}
