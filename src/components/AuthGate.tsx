// Auth temporarily disabled — AuthGate is a passthrough.
export function AuthGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
