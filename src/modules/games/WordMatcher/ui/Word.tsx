import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import { useThemeTokens } from "entities/theme";
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
  const { colors } = useThemeTokens();
  const wordStyles = useMemo(
    () =>
      StyleSheet.create({
        button: { backgroundColor: colors.surface },
        activeButton: { backgroundColor: colors.primary },
        buttonText: { color: colors.text },
        activeButtonText: { color: colors.onPrimary },
      }),
    [colors],
  );

  const scaleStyle = useScaleAnimation(isSelected);
  const errorAnimStyle = useOpacityAnimation(isError);
  const successAnimStyle = useOpacityAnimation(celebrate && isSelected);

  return (
    <Animated.View style={scaleStyle}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        style={[
          styles.button,
          wordStyles.button,
          isSelected && !isError && !celebrate && [styles.activeButton, wordStyles.activeButton],
        ]}>
        {/* сначала красный, затем зелёный верхним слоем */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.errorOverlay, errorAnimStyle]} />
        <Animated.View style={[StyleSheet.absoluteFill, styles.successOverlay, successAnimStyle]} />

        <Text
          style={[
            styles.buttonText,
            wordStyles.buttonText,
            isSelected && [styles.activeButtonText, wordStyles.activeButtonText],
          ]}>
          {word}
        </Text>
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
// error/success overlays are semantic indicators — universal red/green, not theme tokens
const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
  },
  activeButton: {},
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  activeButtonText: {
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  errorOverlay: {
    borderRadius: 12,
    backgroundColor: "#FF4444A4",
  },
  successOverlay: {
    borderRadius: 12,
    backgroundColor: "#33E76FA4",
  },
});

export default WordButton;
