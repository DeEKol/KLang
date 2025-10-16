import { useCallback, useRef } from "react";

export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(fn: T, wait = 300) {
  const t = useRef<NodeJS.Timeout | null>(null);
  return useCallback(
    (...args: unknown[]) => {
      if (t.current) clearTimeout(t.current);
      t.current = setTimeout(() => fn(...args), wait);
    },
    [fn, wait],
  ) as T;
}
