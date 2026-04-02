import React, { useCallback, useEffect, useMemo } from "react";

import type { IWordMap } from "../../ui/GameLayout";

export interface UseWordMatcherReturn {
  filteredNative: string[];
  filteredLearning: string[];
  selectedPair: { left: string; right: string };
  setSelectedPair: React.Dispatch<React.SetStateAction<{ left: string; right: string }>>;
  errorPair: [string, string] | null;
  celebrate: boolean;
  reset: () => void;
  isComplete: boolean;
  isLocked: boolean;
  mistakeCount: number;
  totalCount: number;
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
  const [mistakeCount, setMistakeCount] = React.useState(0);

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

    setMistakeCount((n) => n + 1);
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
    setMistakeCount(0);
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
    mistakeCount,
    totalCount: nativeWords.length,
  };
};
