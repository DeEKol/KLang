import { useEffect, useRef } from "react";

export function useRenderCounter(name = "comp") {
  const counter = useRef(0);

  counter.current++;

  useEffect(() => {
    console.log(`[render] ${name}`, counter.current);
  });
}
