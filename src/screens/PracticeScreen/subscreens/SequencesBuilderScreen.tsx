import React, { useCallback } from "react";
import { useAppDispatch } from "app/providers/StoreProvider";
import { gameResultActions } from "entities/gameResult";
import { saveUserProgress } from "shared/api/userProgressApi";
import { ENavigation, usePracticeNavigation } from "shared/config/navigation";

import type { IGameResult } from "../../../modules/games/_shared/types";
import { SequencesBuilderUI } from "../../../modules/games/SequencesBuilder";

const GAME_NAME = "Sequences Builder";

export const SequencesBuilderScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = usePracticeNavigation();

  const handleComplete = useCallback(
    (result: IGameResult) => {
      dispatch(gameResultActions.setLastResult({ result, gameName: GAME_NAME }));
      navigation.navigate(ENavigation.GAME_RESULT);
      void saveUserProgress(result, GAME_NAME);
    },
    [dispatch, navigation],
  );

  return <SequencesBuilderUI onComplete={handleComplete} />;
};
