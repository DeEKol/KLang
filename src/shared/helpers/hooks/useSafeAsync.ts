import { useEffect, useRef } from "react";

export function useSafeAsync() {
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const run = async <T>(fn: () => Promise<T>, onResult: (res: T) => void) => {
    const res = await fn();
    if (mounted.current) onResult(res);
  };
  return { isMounted: mounted, run };
}
