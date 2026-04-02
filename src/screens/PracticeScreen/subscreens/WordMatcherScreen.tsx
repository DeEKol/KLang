import React, { useCallback } from "react";
import { useAppDispatch } from "app/providers/StoreProvider";
import { gameResultActions } from "entities/gameResult";
import { ENavigation, usePracticeNavigation } from "shared/config/navigation";

import type { IGameResult } from "../../../modules/games/_shared/types";
import { GameLayout } from "../../../modules/games/WordMatcher/ui/GameLayout";

export const WordMatcherScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = usePracticeNavigation();

  const handleComplete = useCallback(
    (result: IGameResult) => {
      dispatch(gameResultActions.setLastResult({ result, gameName: "Word Matcher" }));
      navigation.navigate(ENavigation.GAME_RESULT);
    },
    [dispatch, navigation],
  );

  return (
    <GameLayout
      wordsMap={{
        Cat: "고양이",
        Dog: "개",
        Fish: "물고기",
        Elephant: "코끼리",
      }}
      onComplete={handleComplete}
    />
  );
};
