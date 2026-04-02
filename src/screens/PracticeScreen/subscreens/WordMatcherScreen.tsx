import React, { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "app/providers/StoreProvider";
import { gameResultActions } from "entities/gameResult";
import { getWordPairs } from "entities/vocabulary";
import { saveUserProgress } from "shared/api/userProgressApi";
import { ENavigation, usePracticeNavigation } from "shared/config/navigation";

import type { IGameResult } from "../../../modules/games/_shared/types";
import type { IWordMap } from "../../../modules/games/WordMatcher/ui/GameLayout";
import { GameLayout } from "../../../modules/games/WordMatcher/ui/GameLayout";

const GAME_NAME = "Word Matcher";

export const WordMatcherScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = usePracticeNavigation();
  const pairs = useAppSelector(getWordPairs);

  const wordMap = useMemo<IWordMap>(
    () => Object.fromEntries(pairs.map((p) => [p.native, p.learning])),
    [pairs],
  );

  const handleComplete = useCallback(
    (result: IGameResult) => {
      dispatch(gameResultActions.setLastResult({ result, gameName: GAME_NAME }));
      navigation.navigate(ENavigation.GAME_RESULT);
      void saveUserProgress(result, GAME_NAME);
    },
    [dispatch, navigation],
  );

  return (
    <GameLayout
      config={wordMap}
      onComplete={handleComplete}
    />
  );
};
