import { useEffect } from "react";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

export const useScaleAnimation = (active: boolean) => {
  const scale = useSharedValue(active ? 1.1 : 1);

  useEffect(() => {
    scale.value = withSpring(active ? 1.1 : 1, { damping: 10 });
  }, [active, scale]);

  return useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
};
