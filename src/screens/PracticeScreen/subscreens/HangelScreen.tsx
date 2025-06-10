import React from "react";
import { useTranslation } from "react-i18next";
import { HangelBoard } from "features/HangelBoard";

export const HangelScreen = () => {
  const { t } = useTranslation("practiceScreen");

  return <HangelBoard />;
};
