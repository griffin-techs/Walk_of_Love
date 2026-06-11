/**
 * Custom hook to access device fingerprint data
 * Usage in components: const fingerprint = useFingerprint()
 */

import { useVisitorData } from "@fingerprint/react";
import { FingerprintData } from "@/lib/fingerprint";

const LOCAL_DEVICE_ID_KEY = "local-device-id";

function createLocalDeviceId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `local-${crypto.randomUUID()}`;
  }

  const random = Math.random().toString(36).slice(2, 10);
  return `local-${Date.now().toString(36)}-${random}`;
}

function getOrCreateLocalDeviceId(): string | null {
  if (typeof window === "undefined") return null;

  const existing = localStorage.getItem(LOCAL_DEVICE_ID_KEY);
  if (existing) {
    return existing;
  }

  const generated = createLocalDeviceId();
  localStorage.setItem(LOCAL_DEVICE_ID_KEY, generated);
  return generated;
}

export interface UseFingerprintReturn {
  isLoading: boolean;
  error: Error | null;
  data: FingerprintData | null;
  visitorId: string | null;
  reload: () => void;
}

/**
 * Hook to get device fingerprint information
 * Automatically fetches on component mount
 *
 * @example
 * ```tsx
 * const { isLoading, data, visitorId, error } = useFingerprint()
 *
 * if (isLoading) return <div>Identifying device...</div>
 * if (error) return <div>Error: {error.message}</div>
 *
 * return <div>Device ID: {visitorId}</div>
 * ```
 */
export function useFingerprint(): UseFingerprintReturn {
  const { isLoading, error, data, getData } = useVisitorData({
    immediate: true, // Automatically fetch on mount
  });

  const fallbackDeviceId = getOrCreateLocalDeviceId();

  return {
    isLoading,
    error: error || null,
    data: (data as unknown as FingerprintData) || null,
    visitorId: data?.visitor_id || fallbackDeviceId,
    reload: () => {
      void getData().catch((reloadError) => {
        console.error("Failed to refresh visitor data:", reloadError);
      });
    },
  };
}

/**
 * Store fingerprint data in localStorage for later reference
 */
export function storeFingerprint(data: FingerprintData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "device-fingerprint",
      JSON.stringify({
        ...data,
        storedAt: new Date().toISOString(),
      })
    );
  }
}

/**
 * Retrieve stored fingerprint data from localStorage
 */
export function getStoredFingerprint(): FingerprintData | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem("device-fingerprint");
  return stored ? JSON.parse(stored) : null;
}

/**
 * Clear stored fingerprint data
 */
export function clearStoredFingerprint(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("device-fingerprint");
    localStorage.removeItem(LOCAL_DEVICE_ID_KEY);
  }
}
