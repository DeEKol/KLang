import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, findNodeHandle, UIManager, type View } from "react-native";

import { type TBlankPos } from "../entities/types";

interface IMockData {
  sentenceParts: string[];
  correctAnswers: { [key: string]: string };
  options: string[];
  blanks: { id: number }[];
}

const mockData: IMockData = {
  sentenceParts: ["저는 ", "__1__", "을 학교에 가고 ", "__2__", "은 집에 있어요"],
  correctAnswers: { 1: "책", 2: "고양이" },
  options: ["책", "컴퓨터", "고양이", "자동차"],
  blanks: [{ id: 1 }, { id: 2 }],
};

type TProps = {
  playSuccessSound?: () => void;
  playFailSound?: () => void;
};

export function useSequencesBuilder({ playSuccessSound, playFailSound }: TProps = {}) {
  const [filled, setFilled] = useState<{ [key: number]: { word: string; correct: boolean } }>({});
  const [options, setOptions] = useState<string[]>(mockData.options.slice());
  const [blankPositions, setBlankPositions] = useState<{ [key: number]: TBlankPos }>({});
  const [hints, setHints] = useState<{ [key: number]: "success" | "fail" | null }>({});
  const [victoryVisible, setVictoryVisible] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);

  const blankRefs = useRef<{ [key: number]: View }>({});
  const blankSetters = useRef(new Map<number, (r: View | null) => void>());

  const getSetBlankRef = useCallback((id: number) => {
    if (!blankSetters.current.has(id)) {
      blankSetters.current.set(id, (r: View | null) => {
        if (r) blankRefs.current[id] = r;
      });
    }

    return blankSetters.current.get(id)!;
  }, []);

  const measureBlank = useCallback((id: number) => {
    const ref = blankRefs.current[id];

    if (!ref) return;

    const apply = (x: number, y: number, width: number, height: number) => {
      const next = { x, y: y + 10, width, height };

      setBlankPositions((prev) => {
        const p = prev[id];

        if (
          p &&
          p.x === next.x &&
          p.y === next.y &&
          p.width === next.width &&
          p.height === next.height
        ) {
          return prev;
        }

        return { ...prev, [id]: next };
      });
    };

    if (typeof ref.measureInWindow === "function") {
      try {
        ref.measureInWindow((x: number, y: number, width: number, height: number) => {
          if (typeof x === "number" && typeof y === "number") apply(x, y, width, height);
        });
      } catch (err) {
        console.error(err);
      }

      return;
    }

    const node = findNodeHandle(ref);

    if (!node) return;

    UIManager.measureInWindow(node, (x: number, y: number, width: number, height: number) => {
      if (typeof x === "number" && typeof y === "number") apply(x, y, width, height);
    });
  }, []);

  const measureAll = useCallback(() => {
    requestAnimationFrame(() => {
      mockData.blanks.forEach((b) => measureBlank(b.id));
    });
  }, [measureBlank]);

  useEffect(() => {
    measureAll();
    const sub = Dimensions.addEventListener?.("change", measureAll) ?? null;

    return () => {
      if (sub && typeof sub.remove === "function") sub.remove();
    };
  }, [measureAll]);

  const showHint = useCallback(
    (id: number, type: "success" | "fail") => {
      setHints((prev) => ({ ...prev, [id]: type }));

      if (type === "success") {
        playSuccessSound?.();
      } else {
        playFailSound?.();
      }

      setTimeout(() => {
        setHints((prev) => ({ ...prev, [id]: null }));
      }, 900);
    },
    [playFailSound, playSuccessSound],
  );

  const handleDrop = useCallback(
    (word: string, blankId: number | undefined) => {
      if (blankId == null) return;

      const correct = mockData.correctAnswers[String(blankId)] === word;

      setFilled((prev) => {
        const before = prev[blankId];

        if (before && before.word === word && before.correct === correct) return prev;

        return { ...prev, [blankId]: { word, correct } };
      });

      if (correct) {
        setOptions((prev) => prev.filter((p) => p !== word));
        showHint(blankId, "success");
      } else {
        setMistakeCount((n) => n + 1);
        showHint(blankId, "fail");
      }
    },
    [showHint],
  );

  const correctCount = useMemo(
    () => Object.values(filled).filter((f) => f.correct).length,
    [filled],
  );

  useEffect(() => {
    if (correctCount === mockData.blanks.length && mockData.blanks.length > 0) {
      setVictoryVisible(true);
    }
  }, [correctCount]);

  const resetAll = useCallback(() => {
    setFilled({});
    setOptions(mockData.options.slice());
    setHints({});
    setVictoryVisible(false);
    setMistakeCount(0);
    setTimeout(() => measureAll(), 80);
  }, [measureAll]);

  return {
    sentenceParts: mockData.sentenceParts,
    blanks: mockData.blanks,
    filled,
    options,
    blankPositions,
    hints,
    victoryVisible,
    setVictoryVisible,
    correctCount,
    mistakeCount,
    getSetBlankRef,
    measureBlank,
    handleDrop,
    resetAll,
  };
}
