import React, { useCallback } from "react";
import { useAppDispatch } from "app/providers/StoreProvider";
import { gameResultActions } from "entities/gameResult";
import { ENavigation, usePracticeNavigation } from "shared/config/navigation";

import type { IGameResult } from "../../../modules/games/_shared/types";
import { SequencesBuilderUI } from "../../../modules/games/SequencesBuilder";

export const SequencesBuilderScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = usePracticeNavigation();

  const handleComplete = useCallback(
    (result: IGameResult) => {
      dispatch(gameResultActions.setLastResult({ result, gameName: "Sequences Builder" }));
      navigation.navigate(ENavigation.GAME_RESULT);
    },
    [dispatch, navigation],
  );

  return <SequencesBuilderUI onComplete={handleComplete} />;
};
