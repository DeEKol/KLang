import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useAppDispatch, useAppSelector } from "app/providers/StoreProvider";
import { gameResultActions, getLastGameName, getLastGameResult } from "entities/gameResult";
import { useThemeTokens } from "entities/theme";
import { usePracticeNavigation } from "shared/config/navigation";
import { Button } from "shared/ui/paper-kit";

import createStyles from "./GameResultScreen.styles";

export const GameResultScreen = () => {
  const { colors } = useThemeTokens();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation("gameResultScreen");

  const dispatch = useAppDispatch();
  const navigation = usePracticeNavigation();
  const result = useAppSelector(getLastGameResult);
  const gameName = useAppSelector(getLastGameName);

  const handleContinue = useCallback(() => {
    dispatch(gameResultActions.clearLastResult());
    navigation.goBack();
  }, [dispatch, navigation]);

  if (!result) {
    return null;
  }

  const scorePercent = Math.round(result.score * 100);
  const seconds = Math.round(result.timeMs / 1000);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {gameName && <Text style={styles.gameName}>{gameName}</Text>}
        <Text style={styles.title}>{t("title")}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{`${scorePercent}%`}</Text>
            <Text style={styles.statLabel}>{t("score")}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{`${seconds}с`}</Text>
            <Text style={styles.statLabel}>{t("time")}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{String(result.mistakes)}</Text>
            <Text style={styles.statLabel}>{t("mistakes")}</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Button
          style={styles.continueButton}
          onPress={handleContinue}>
          {t("continue")}
        </Button>
      </View>
    </View>
  );
};
