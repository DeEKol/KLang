import React, { useCallback } from "react";

import type { IGameResult } from "../../../modules/games/_shared/types";
import { SequencesBuilderUI } from "../../../modules/games/SequencesBuilder";

export const SequencesBuilderScreen = () => {
  const handleComplete = useCallback((result: IGameResult) => {
    // TODO(GAME-S4): dispatch result to Redux / navigate to results screen
    console.log("[SequencesBuilder] complete", result);
  }, []);

  return <SequencesBuilderUI onComplete={handleComplete} />;
};
