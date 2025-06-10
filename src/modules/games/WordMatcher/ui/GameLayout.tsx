import React, { useCallback } from "react";
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { LottieImage } from "shared/lottie";

import { useColumnsAnimation } from "../model/animation/useColumnAnimations";
import { useWordMatcher } from "../model/logic/useWordMatcher";
import { Column, Dialog, Winning } from "../ui";

// -----------------------------------
// Types
// -----------------------------------
export interface IWordMap {
  [nativeWord: string]: string;
}

export interface IGameLayoutProps {
  wordsMap: IWordMap;
}

// -----------------------------------
// Component
// -----------------------------------
export const GameLayout: React.FC<IGameLayoutProps> = ({ wordsMap }) => {
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
  } = useWordMatcher(wordsMap);

  const { leftStyle, rightStyle, resetAnimation } = useColumnsAnimation(isComplete);

  const select = useCallback(
    (side: "left" | "right", value: string) => {
      if (!isLocked) {
        setSelectedPair((prev) => ({ ...prev, [side]: value }));
      }
    },
    [setSelectedPair, isLocked],
  );

  return (
    <LinearGradient
      colors={["#c2e9fb", "#a1c4fd"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <Text style={styles.title}>{"Word Matcher"}</Text>
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
        <Text>{"Reset"}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

// -----------------------------------
// Styles
// -----------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },
  columnsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    flex: 1,
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#2c3e50",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginTop: 16,
  },
  resetButton: {
    position: "absolute",
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
    bottom: 16,
    right: 16,
    zIndex: 1004,
  },
});
