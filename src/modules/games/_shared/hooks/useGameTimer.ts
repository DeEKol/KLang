import { useCallback, useEffect, useRef, useState } from "react";

export function useGameTimer(autoStart = true) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(autoStart);
  const startRef = useRef<number | null>(autoStart ? Date.now() : null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      if (!startRef.current) startRef.current = Date.now() - elapsedMs;
      intervalRef.current = setInterval(() => {
        setElapsedMs(Date.now() - (startRef.current ?? Date.now()));
      }, 200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  const pause = useCallback(() => setRunning(false), []);

  const resume = useCallback(() => setRunning(true), []);

  const reset = useCallback(() => {
    setElapsedMs(0);
    startRef.current = null;
    setRunning(false);
  }, []);

  return { elapsedMs, running, pause, resume, reset };
}
