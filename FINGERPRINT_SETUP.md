# Device Fingerprinting Integration Guide

## Overview

Device fingerprinting has been integrated into Walk of Love using **FingerprintJS**. This provides unique device identification for security, device tracking, and multi-device management.

**Documentation**: https://docs.fingerprint.com/docs/react

---

## Setup Steps

### 1. Get Your API Key

1. Go to [fingerprint.com](https://fingerprint.com) and create an account
2. Navigate to the Dashboard and copy your **Public API Key**
3. Choose your region: `us` (default) or `eu`

### 2. Configure Environment Variables

Add to `.env`:

```env
VITE_FINGERPRINT_API_KEY=your_public_api_key_here
VITE_FINGERPRINT_REGION=us
```

Replace `your_public_api_key_here` with your actual key from Fingerprint.

### 3. Restart Development Server

```bash
npm run dev
npm run worker:dev
```

---

## How It Works

### Architecture

```
Root Component (__root.tsx)
  └─ FingerprintProvider wrapper
     └─ Your App
        └─ Any component can use useFingerprint() hook
```

### Components Created

#### 1. **Fingerprint Configuration** (`src/lib/fingerprint.ts`)
- Stores API key and region from environment
- Provides TypeScript types for fingerprint data

#### 2. **useFingerprint Hook** (`src/hooks/use-fingerprint.tsx`)
- Custom hook to access device fingerprint in components
- Automatically fetches on component mount
- Returns: `isLoading`, `error`, `data`, `visitorId`, `reload()`

#### 3. **DeviceFingerprintInfo Component** (`src/components/DeviceFingerprintInfo.tsx`)
- Ready-to-use component showing fingerprint details
- Displays visitor ID, confidence score, browser info, OS

#### 4. **FingerprintDemo Component** (`src/components/FingerprintDemo.tsx`)
- Example implementation with copy-to-clipboard
- Shows full JSON data
- Helpful error messages for setup issues

---

## Usage Examples

### Basic Usage in a Component

```tsx
import { useFingerprint } from "@/hooks/use-fingerprint";

export function MyComponent() {
  const { isLoading, error, data, visitorId } = useFingerprint();

  if (isLoading) return <p>Identifying device...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <p>Your device ID: {visitorId}</p>;
}
```

### Store Fingerprint with User Profile

```tsx
import { useFingerprint, storeFingerprint } from "@/hooks/use-fingerprint";
import { useEffect } from "react";

export function LoginComponent() {
  const { data } = useFingerprint();

  useEffect(() => {
    if (data) {
      // Store when user logs in
      storeFingerprint(data);
      
      // Send to backend
      fetch("/api/user/fingerprints", {
        method: "POST",
        body: JSON.stringify({
          visitor_id: data.visitor_id,
          confidence_score: data.confidence?.score,
          device_name: `${data.browser_details?.browser_name} on ${data.browser_details?.os}`,
        }),
      });
    }
  }, [data]);

  // ... rest of component
}
```

### Use with Auth System

The fingerprint can be stored with user sessions for device tracking:

```tsx
// In your auth flow
const { visitorId, data } = useFingerprint();

await authClient.signIn.email({
  email,
  password,
  // Could be extended to store device info
  device_fingerprint: visitorId,
  device_info: data?.browser_details,
});
```

### Copy Fingerprint to Clipboard

```tsx
import { useFingerprint } from "@/hooks/use-fingerprint";

export function CopyFingerprintButton() {
  const { visitorId } = useFingerprint();

  const copy = () => {
    navigator.clipboard.writeText(visitorId || "");
  };

  return (
    <button onClick={copy}>
      Copy Device ID: {visitorId?.slice(0, 8)}...
    </button>
  );
}
```

---

## Available Fingerprint Data

The `useFingerprint()` hook returns data with:

```typescript
{
  visitor_id: string;           // Unique device identifier
  confidence: {
    score: number;              // 0-1 accuracy score
  };
  browser_details?: {
    browser_name?: string;      // e.g., "Chrome", "Safari"
    browser_version?: string;
    os?: string;                // e.g., "Windows 10", "iOS 16"
    platform?: string;
  };
  ip_address?: string;
  timestamp?: string;
  // ... additional fields
}
```

---

## Local Storage

Fingerprints are automatically cached in localStorage under `device-fingerprint`:

```tsx
import { 
  getStoredFingerprint, 
  clearStoredFingerprint 
} from "@/hooks/use-fingerprint";

// Retrieve cached fingerprint
const cached = getStoredFingerprint();

// Clear cache
clearStoredFingerprint();
```

---

## Security Considerations

1. **Public API Key**: The API key is public-facing (hence `VITE_` prefix). It's safe to expose.
2. **Device Tracking**: Store fingerprints server-side with user accounts for device verification
3. **Privacy**: Inform users that device identification is happening
4. **Rate Limiting**: Fingerprint.com has rate limits on API calls; don't call excessively
5. **Error Handling**: If API calls fail, gracefully degrade (don't break auth)

---

## Troubleshooting

### "API Key not configured" Error

**Problem**: You see an error about missing API key

**Solution**:
1. Check `.env` has `VITE_FINGERPRINT_API_KEY=...`
2. Restart dev server: `npm run dev`
3. Check browser console for the full error

### Fingerprint Not Loading

**Problem**: `useFingerprint()` always returns `isLoading: true`

**Solution**:
1. Check network tab in DevTools for API calls
2. Verify API key is correct at fingerprint.com dashboard
3. Check region matches where you registered your key
4. Try in a private/incognito window (some browser extensions block it)

### Different Device ID After Clearing Cache

**Problem**: Device ID changes after clearing browser cache/localStorage

**This is expected**. The fingerprint changes when:
- Browser is cleared
- Browser extensions change
- Hardware configuration changes
- Too much time has passed (IDs can vary)

Use higher confidence scores for critical operations.

---

## Integration with Walk of Love

### Ideas for Implementation

1. **Device Verification on Login**
   - Store device fingerprint with each login
   - Alert user on suspicious new device
   - Multi-device session tracking

2. **Diary Security**
   - Require device fingerprint match to access diary
   - Prevent sharing of session across devices

3. **Profile Protection**
   - Link profile edits to device fingerprints
   - Audit trail of which devices changed profile

4. **Photo Album Sync**
   - Track which devices uploaded photos
   - Sync photos across user's trusted devices

---

## Files Changed

- ✅ `.env` — Added `VITE_FINGERPRINT_API_KEY` and `VITE_FINGERPRINT_REGION`
- ✅ `src/routes/__root.tsx` — Added `FingerprintProvider` wrapper
- ✅ `src/lib/fingerprint.ts` — Configuration and types
- ✅ `src/hooks/use-fingerprint.tsx` — Custom hook for accessing fingerprints
- ✅ `src/components/DeviceFingerprintInfo.tsx` — Info display component
- ✅ `src/components/FingerprintDemo.tsx` — Demo/example component

---

## Next Steps

1. ✅ Set your API key in `.env`
2. ✅ Test with `FingerprintDemo` component on a test page
3. ✅ Integrate into login/auth flow
4. ✅ Add to backend D1 schema for device tracking
5. ✅ Create device management UI in profile page

---

## References

- [Fingerprint.com Docs](https://docs.fingerprint.com/docs/react)
- [React SDK GitHub](https://github.com/fingerprintjs/fingerprint-pro-react)
- [API Reference](https://docs.fingerprint.com/docs/api)
