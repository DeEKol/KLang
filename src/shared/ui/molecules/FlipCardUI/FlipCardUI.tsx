// ? Library Imports
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAppSelector } from "app/providers/StoreProvider/StoreProvider";
import { getThemeMode, type TThemeMode } from "entities/theme";
import { EButtonUITheme } from "shared/ui/atoms";

// ? Slice Imports
import FlipCardUIStyles from "./FlipCardUI.styles";

// ? Types
type TFlipCardUIProps = {
  frontText: string;
  backText: string;
};
export const FlipCardUI = (props: TFlipCardUIProps) => {
  // ? Props From
  const { frontText, backText } = props;

  // ? Hooks
  const rotation = useSharedValue(0);
  const themeGlobal: TThemeMode = useAppSelector(getThemeMode);
  const [flipped, setFlipped] = useState(false);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateY: `${interpolate(rotation.value, [0, 180], [0, 180])}deg`,
        },
      ],
      backfaceVisibility: "hidden",
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateY: `${interpolate(rotation.value, [0, 180], [180, 360])}deg`,
        },
      ],
      backfaceVisibility: "hidden",
    };
  });

  /*
   * Функция, переворот карточки
   */
  const flipCard = () => {
    // ! React
    setFlipped(!flipped);
    rotation.value = withTiming(flipped ? 0 : 180, { duration: 500 });
  };

  const styles = FlipCardUIStyles(EButtonUITheme.DEFAULT, themeGlobal);

  // ? Render
  return (
    <Pressable
      onPress={flipCard}
      style={styles.container}>
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, styles.frontCard, frontAnimatedStyle]}>
          <Text style={styles.text}>{frontText}</Text>
        </Animated.View>

        <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
          <Text style={styles.text}>{backText}</Text>
        </Animated.View>
      </View>
    </Pressable>
  );
};
