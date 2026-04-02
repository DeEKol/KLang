import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { useThemeTokens } from "entities/theme";
import { LottieImage } from "shared/lottie";

import { useGameTimer } from "../../_shared/hooks/useGameTimer";
import type { IGameProps, IGameResult } from "../../_shared/types";
import { useColumnsAnimation } from "../model/animation/useColumnAnimations";
import { useWordMatcher } from "../model/logic/useWordMatcher";
import { Column, Dialog, Winning } from "../ui";

import createStyles from "./GameLayout.styles";

// -----------------------------------
// Types
// -----------------------------------
export interface IWordMap {
  [nativeWord: string]: string;
}

export type IGameLayoutProps = IGameProps<IWordMap>;

// -----------------------------------
// Component
// -----------------------------------
export const GameLayout: React.FC<IGameLayoutProps> = ({ config, onComplete }) => {
  const { colors } = useThemeTokens();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { t } = useTranslation("wordMatcher");

  const {
    filteredNative,
    filteredLearning,
    selectedPair,
    setSelectedPair,
    errorPair,
    celebrate,
    reset,
    isComplete,
    isLocked,
    mistakeCount,
    totalCount,
  } = useWordMatcher(config);

  const { elapsedMs, pause } = useGameTimer();
  const { leftStyle, rightStyle, resetAnimation } = useColumnsAnimation(isComplete);

  useEffect(() => {
    if (isComplete) {
      pause();
      onComplete?.({
        score: totalCount / (totalCount + mistakeCount),
        timeMs: elapsedMs,
        mistakes: mistakeCount,
      });
    }
  }, [isComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  const select = useCallback(
    (side: "left" | "right", value: string) => {
      if (!isLocked) {
        setSelectedPair((prev) => ({ ...prev, [side]: value }));
      }
    },
    [setSelectedPair, isLocked],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("title")}</Text>
      <View
        style={styles.columnsContainer}
        pointerEvents={isLocked ? "none" : "auto"}>
        <Animated.View style={leftStyle}>
          <Column
            words={filteredNative}
            value={selectedPair.left}
            setValue={(val) => select("left", val)}
            errorPair={errorPair}
            side="left"
            isMatchComplete={isComplete}
            celebrate={celebrate}
          />
        </Animated.View>

        <Animated.View style={rightStyle}>
          <Column
            words={filteredLearning}
            value={selectedPair.right}
            setValue={(val) => select("right", val)}
            errorPair={errorPair}
            side="right"
            isMatchComplete={isComplete}
            celebrate={celebrate}
          />
        </Animated.View>
      </View>

      <LottieImage
        name="confetti"
        visible={isComplete}
      />
      <LottieImage
        name="girl"
        visible={isComplete}
      />
      <Winning isMatchComplete={isComplete} />
      <Dialog
        celebrate={celebrate}
        isMatchComplete={isComplete}
      />
      <TouchableOpacity
        onPress={() => {
          reset();
          resetAnimation();
        }}
        style={styles.resetButton}
        disabled={isLocked}>
        <Text>{t("reset")}</Text>
      </TouchableOpacity>
    </View>
  );
};
