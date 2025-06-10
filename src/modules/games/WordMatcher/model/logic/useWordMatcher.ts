import React, { useCallback, useEffect, useMemo, useRef } from "react";

import type { IWordMap } from "../../ui/GameLayout";

export interface UseWordMatcherReturn {
  filteredNative: string[];
  filteredLearning: string[];
  selectedPair: { left: string; right: string };
  setSelectedPair: (pair: { left: string; right: string }) => void;
  errorPair: [string, string] | null;
  celebrate: boolean;
  reset: () => void;
  isComplete: boolean;
  isLocked: boolean;
}

export const useWordMatcher = (wordsMap: IWordMap): UseWordMatcherReturn => {
  const nativeWords = useMemo(() => Object.keys(wordsMap), [wordsMap]);
  const learningWords = useMemo(() => Object.values(wordsMap), [wordsMap]);

  const [filteredNative, setFilteredNative] = React.useState<string[]>(nativeWords);
  const [filteredLearning, setFilteredLearning] = React.useState<string[]>(learningWords);
  const [selectedPair, setSelectedPair] = React.useState<Record<"left" | "right", string>>({
    left: "",
    right: "",
  });
  const [errorPair, setErrorPair] = React.useState<[string, string] | null>(null);
  const [celebrate, setCelebrate] = React.useState<boolean>(false);

  // Matching logic
  useEffect(() => {
    const { left, right } = selectedPair;
    if (!left || !right) return;

    if (wordsMap[left] === right) {
      setCelebrate(true);
      const t = setTimeout(() => {
        setFilteredNative((prev) => prev.filter((w) => w !== left));
        setFilteredLearning((prev) => prev.filter((w) => w !== right));
        setSelectedPair({ left: "", right: "" });
        setCelebrate(false);
      }, 1000);
      return () => clearTimeout(t);
    }

    setErrorPair([left, right]);
    const t = setTimeout(() => {
      setErrorPair(null);
      setSelectedPair({ left: "", right: "" });
    }, 1000);
    return () => clearTimeout(t);
  }, [selectedPair, wordsMap]);

  // Reset
  const reset = useCallback(() => {
    setFilteredNative(nativeWords);
    setFilteredLearning(learningWords);
    setSelectedPair({ left: "", right: "" });
    setErrorPair(null);
    setCelebrate(false);
  }, [nativeWords, learningWords]);

  // Flags
  const isComplete = filteredNative.length === 0;
  const isLocked = Boolean(celebrate || errorPair);

  return {
    filteredNative,
    filteredLearning,
    selectedPair,
    setSelectedPair,
    errorPair,
    celebrate,
    reset,
    isComplete,
    isLocked,
  };
};
