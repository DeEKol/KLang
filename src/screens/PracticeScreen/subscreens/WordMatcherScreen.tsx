import React, { useCallback } from "react";

import type { IGameResult } from "../../../modules/games/_shared/types";
import { GameLayout } from "../../../modules/games/WordMatcher/ui/GameLayout";

export const WordMatcherScreen = () => {
  const handleComplete = useCallback((result: IGameResult) => {
    // TODO(GAME-S4): dispatch result to Redux / navigate to results screen
    console.log("[WordMatcher] complete", result);
  }, []);

  return (
    <GameLayout
      wordsMap={{
        Cat: "고양이",
        Dog: "개",
        Fish: "물고기",
        Elephant: "코끼리",
        // Monkey: "원숭이",
        // Lion: "사자",
        // Whale: "고래",
        // Horse: "말",
        // Tiger: "호랑이",
        // Shark: "상어",
        // Wolf: "늑대",
      }}
      onComplete={handleComplete}
    />
  );
};
