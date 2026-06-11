/**
 * Fingerprint configuration and utilities
 * Device fingerprinting for security and device tracking
 * Documentation: https://docs.fingerprint.com/docs/react
 */

export const FINGERPRINT_CONFIG = {
  // Get from environment, default to empty string (user must set)
  apiKey: import.meta.env.VITE_FINGERPRINT_API_KEY || "",
  region: (import.meta.env.VITE_FINGERPRINT_REGION as "us" | "eu") || "us",
  endpoint: import.meta.env.VITE_FINGERPRINT_ENDPOINT || undefined,
};

export const FINGERPRINT_ENABLED = Boolean(FINGERPRINT_CONFIG.apiKey?.trim());

/**
 * Types for fingerprint data
 */
export interface FingerprintData {
  visitor_id: string;
  confidence: {
    score: number;
  };
  browser_details?: {
    browser_name?: string;
    browser_version?: string;
    os?: string;
    platform?: string;
  };
  ip_address?: string;
  timestamp?: string;
  [key: string]: any;
}

/**
 * Hook to get fingerprint data - use in components with useVisitorData
 * Example usage:
 *
 * import { useVisitorData } from '@fingerprint/react'
 *
 * export function MyComponent() {
 *   const { isLoading, error, data } = useVisitorData({ immediate: true })
 *
 *   if (isLoading) return <p>Identifying device...</p>
 *   if (error) return <p>Error: {error.message}</p>
 *
 *   return <p>Your device ID: {data?.visitor_id}</p>
 * }
 */
