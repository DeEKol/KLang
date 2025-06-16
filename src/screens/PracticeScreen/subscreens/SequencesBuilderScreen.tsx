import React from "react";
import { useTranslation } from "react-i18next";
import { SequencesBuilderUI } from "features/SequencesBuilder";

export const SequencesBuilderScreen = () => {
  const { t } = useTranslation("practiceScreen");

  return <SequencesBuilderUI />;
};
