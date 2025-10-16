import { useCallback, useRef } from "react";

export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit = 300,
) {
  const last = useRef(0);
  return useCallback(
    (...args: unknown[]) => {
      const now = Date.now();
      if (now - last.current >= limit) {
        last.current = now;
        fn(...args);
      }
    },
    [fn, limit],
  ) as T;
}
