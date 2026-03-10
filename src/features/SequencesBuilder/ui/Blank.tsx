import React, { forwardRef, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type BlankProps = {
  id: number;
  filled?: { word: string; correct: boolean };
  innerRef?: (r: any) => void;
  onLayout?: () => void;
};

export const Blank = ({ id, filled, innerRef, onLayout }: BlankProps) => {
  // progress for color highlight (0 -> 1)
  const colorProgress = useSharedValue(0);
  // 0 = none, 1 = correct, 2 = incorrect
  const colorMode = useSharedValue(0);
  // word appearance progress
  const wordProgress = useSharedValue(0);

  useEffect(() => {
    if (filled) {
      // set color mode (1 or 2)
      colorMode.value = filled.correct ? 1 : 2;
      // animate highlight in and then fade out after a bit
      colorProgress.value = withSequence(
        withTiming(1, { duration: 280 }),
        withDelay(700, withTiming(0, { duration: 400 })),
      );
      // show word
      wordProgress.value = withSequence(withTiming(1, { duration: 300 }));
    } else {
      // hide word & reset
      wordProgress.value = withTiming(0, { duration: 200 });
      colorProgress.value = withTiming(0, { duration: 200 });
      colorMode.value = 0;
    }
  }, [filled, colorMode, colorProgress, wordProgress]);

  const animatedOuter = useAnimatedStyle(() => {
    const bg =
      colorMode.value === 1
        ? interpolateColor(colorProgress.value, [0, 1], ["transparent", "#C8E6C9"])
        : colorMode.value === 2
          ? interpolateColor(colorProgress.value, [0, 1], ["transparent", "#FFCDD2"])
          : "transparent";
    return {
      backgroundColor: bg,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 6,
      minWidth: 60,
      alignItems: "center",
      justifyContent: "center",
    };
  });

  const animatedWord = useAnimatedStyle(() => ({
    opacity: wordProgress.value,
    transform: [{ translateY: (1 - wordProgress.value) * -8 }],
  }));

  // forwarded ref wrapper so parent can measure
  const Inner = forwardRef<any, any>((props, ref) => (
    <Animated.View
      ref={(r) => {
        // pass both animated ref and raw ref up
        if (innerRef) innerRef(r);
        // also attach forwarded ref
        if (typeof ref === "function") ref(r);
        else if (ref && typeof ref === "object") (ref as any).current = r;
      }}
      onLayout={onLayout}
      style={[styles.blankContainer, props.style]}>
      {props.children}
    </Animated.View>
  ));

  Inner.displayName = "InnerComponent";

  return (
    <Inner style={animatedOuter}>
      <Animated.View style={animatedWord}>
        <Text style={styles.blankText}>{filled?.word || "______"}</Text>
      </Animated.View>
    </Inner>
  );
};

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  blankContainer: {
    borderRadius: 4,
    marginHorizontal: 2,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  blankText: {
    textAlign: "center",
    fontSize: 18,
  },
});
