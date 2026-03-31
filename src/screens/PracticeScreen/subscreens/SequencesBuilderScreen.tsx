import React from "react";
import { useTranslation } from "react-i18next";

import { SequencesBuilderUI } from "../../../modules/games/SequencesBuilder";

export const SequencesBuilderScreen = () => {
  const { t } = useTranslation("practiceScreen");

  return <SequencesBuilderUI />;
};
