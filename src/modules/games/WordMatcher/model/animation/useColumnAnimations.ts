import { useCallback, useEffect } from "react";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

export const useColumnsAnimation = (isComplete: boolean) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (isComplete) {
      progress.value = withSpring(1, { damping: 8, stiffness: 50 });
    }
  }, [isComplete, progress]);

  const resetAnimation = useCallback(() => {
    progress.value = withSpring(0, { damping: 8, stiffness: 50 });
  }, [progress]);

  const leftStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [{ translateX: progress.value * -200 }],
  }));

  const rightStyle = useAnimatedStyle(() => ({
    flex: 1,
    transform: [{ translateX: progress.value * 200 }],
  }));

  return { leftStyle, rightStyle, resetAnimation };
};
