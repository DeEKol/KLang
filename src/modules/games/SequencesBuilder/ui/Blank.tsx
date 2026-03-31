import React, { useEffect } from "react";
import { StyleSheet, Text, type View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useThemeTokens } from "entities/theme";

export type TBlankHint = "success" | "fail" | null;

type TBlankProps = {
  filled?: { word: string; correct: boolean } | undefined;
  innerRef?: (r: View | null) => void;
  onLayout?: () => void;
  hint?: TBlankHint;
};

export const Blank: React.FC<TBlankProps> = ({ filled, innerRef, onLayout, hint }) => {
  const { colors } = useThemeTokens();
  const bgProgress = useSharedValue(0);
  const iconProgress = useSharedValue(0);
  const iconScale = useSharedValue(0.2);

  useEffect(() => {
    if (hint === "success") {
      bgProgress.value = withTiming(1, { duration: 160 });
      iconProgress.value = withDelay(
        80,
        withTiming(1, { duration: 240, easing: Easing.out(Easing.ease) }),
      );
      iconScale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.back(2)) });
      const t = setTimeout(() => {
        bgProgress.value = withTiming(0, { duration: 340 });
        iconProgress.value = withTiming(0, { duration: 200 });
        iconScale.value = withTiming(0.2, { duration: 200 });
      }, 900);
      return () => clearTimeout(t);
    } else if (hint === "fail") {
      bgProgress.value = withTiming(1, { duration: 120 });
      iconProgress.value = withTiming(1, { duration: 160 });
      iconScale.value = withTiming(1, { duration: 220 });
      const t = setTimeout(() => {
        bgProgress.value = withTiming(0, { duration: 300 });
        iconProgress.value = withTiming(0, { duration: 200 });
        iconScale.value = withTiming(0.2, { duration: 200 });
      }, 700);
      return () => clearTimeout(t);
    }
    bgProgress.value = withTiming(0, { duration: 200 });
    iconProgress.value = withTiming(0, { duration: 200 });
    iconScale.value = withTiming(0.2, { duration: 200 });
  }, [hint, bgProgress, iconProgress, iconScale]);

  const animatedBg = useAnimatedStyle(() => {
    if (filled?.correct) {
      const alpha = bgProgress.value;
      return { backgroundColor: `rgba(46,125,50, ${0.12 * alpha})` };
    }
    if (hint === "fail") {
      const alpha = bgProgress.value;
      return { backgroundColor: `rgba(211,47,47, ${0.12 * alpha})` };
    }
    return { backgroundColor: "transparent" };
  });

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconProgress.value,
    transform: [{ scale: iconScale.value }],
    position: "absolute",
    right: -8,
    top: -8,
  }));

  return (
    <Animated.View
      ref={(r) => innerRef && innerRef(r as unknown as View | null)}
      onLayout={onLayout}
      style={[styles.blankContainer, { borderColor: colors.border }, animatedBg]}>
      <Text
        style={[
          styles.blankText,
          filled ? [styles.blankWord, { color: colors.text }] : { color: colors.placeholder },
        ]}>
        {filled?.word ?? "____"}
      </Text>
      <Animated.View
        style={iconStyle}
        pointerEvents="none">
        <Text style={styles.iconText}>
          {filled?.correct || hint === "success" ? "✅" : hint === "fail" ? "❌" : ""}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  blankContainer: {
    minWidth: 70,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  blankText: {
    fontSize: 17,
  },
  blankWord: {
    fontWeight: "700",
  },
  iconText: {
    fontSize: 18,
  },
});
