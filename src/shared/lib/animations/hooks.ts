import React, { useCallback } from "react";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export const usePulseAnimation = (minScale = 0.95, maxScale = 1.05) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(minScale, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(maxScale, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  return useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
};

export const usePressAnimation = (scaleDown = 0.95) => {
  const scale = useSharedValue(1);

  const trigger = useCallback(() => {
    scale.value = withSequence(
      withTiming(scaleDown, { duration: 50 }),
      withSpring(1, { damping: 10 }),
    );
  }, [scale, scaleDown]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animStyle, trigger };
};

export const useShakeAnimation = (intensity = 5) => {
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(intensity, { duration: 50 }),
        withTiming(-intensity, { duration: 100 }),
        withTiming(intensity, { duration: 100 }),
        withTiming(0, { duration: 50 }),
      ),
      -1,
      false,
    );
  }, []);

  return useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
};
