import { useEffect, useState, ReactNode } from "react";

/**
 * Wrapper that defers rendering until client hydration is complete.
 * Prevents hydration mismatches for interactive/random components.
 */
export function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? children : null;
}
