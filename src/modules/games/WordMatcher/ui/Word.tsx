import React, { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SpeakButton } from "shared/tts";

import { useOpacityAnimation } from "../model/animation/useOpacityAnimation";
import { useScaleAnimation } from "../model/animation/useScaleAnimation";

// -----------------------------------
// Types
// -----------------------------------
export interface WordButtonProps {
  word: string;
  onPress: () => void;
  isSelected: boolean;
  isError: boolean;
  celebrate: boolean;
}

// -----------------------------------
// Component
// -----------------------------------
const WordButton: React.FC<WordButtonProps> = ({
  word,
  onPress,
  isSelected,
  isError,
  celebrate,
}) => {
  const scaleAnim = useScaleAnimation(isSelected);
  const errorOpacity = useOpacityAnimation(isError);
  const successOpacity = useOpacityAnimation(celebrate && isSelected);

  const errorStyle = useMemo(
    () => ({
      borderRadius: 12,
      backgroundColor: "#FF4444A4",
      opacity: errorOpacity,
    }),
    [errorOpacity],
  );
  const successStyle = useMemo(
    () => ({
      borderRadius: 12,
      backgroundColor: "#33E76FA4",
      opacity: successOpacity,
    }),
    [successOpacity],
  );

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.button, isSelected && !isError && !celebrate && styles.activeButton]}>
        {/* сначала красный, затем зелёный верхним слоем */}
        <Animated.View style={[StyleSheet.absoluteFill, errorStyle]} />
        <Animated.View style={[StyleSheet.absoluteFill, successStyle]} />

        <Text style={[styles.buttonText, isSelected && styles.activeButtonText]}>{word}</Text>
        <SpeakButton
          text={word}
          lang="en-US"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

// -----------------------------------
// Styles
// -----------------------------------
const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    backgroundColor: "#fff",
  },
  activeButton: {
    backgroundColor: "#4dc9e6",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#495057",
  },
  activeButtonText: {
    color: "white",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default WordButton;
