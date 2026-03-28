import { useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export const useOpacityAnimation = (trigger: boolean) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!trigger) return;
    opacity.value = withSequence(withTiming(1, { duration: 0 }), withTiming(0, { duration: 1000 }));
  }, [trigger, opacity]);

  return useAnimatedStyle(() => ({ opacity: opacity.value }));
};
