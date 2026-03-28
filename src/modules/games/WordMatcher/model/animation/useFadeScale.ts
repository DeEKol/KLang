import { useEffect } from "react";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

export const useFadeScale = (visible: boolean) => {
  const progress = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(visible ? 1 : 0);
  }, [visible, progress]);

  return useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: progress.value }],
  }));
};
