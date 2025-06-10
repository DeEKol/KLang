import React from "react";
import { useTranslation } from "react-i18next";

import { GameLayout } from "../../../modules/games/WordMatcher/ui/GameLayout";

export const WordMatcherScreen = () => {
  const { t } = useTranslation("practiceScreen");

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
    />
  );
};
