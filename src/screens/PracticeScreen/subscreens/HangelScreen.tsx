import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";

import { HangelBoard } from "../../../modules/games/HangelBoard";

export const HangelScreen = () => {
  const navigation = useNavigation();
  const handleExit = useCallback(() => navigation.goBack(), [navigation]);

  return <HangelBoard onExit={handleExit} />;
};
