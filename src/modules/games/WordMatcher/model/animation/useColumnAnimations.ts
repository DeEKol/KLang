import { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated } from "react-native";

export const useColumnsAnimation = (isComplete: boolean) => {
  const anim = useRef(new Animated.Value(0)).current;
  const defaultConfig = { friction: 8, tension: 50, useNativeDriver: true };

  useEffect(() => {
    if (isComplete) {
      Animated.spring(anim, {
        toValue: 1,
        ...defaultConfig,
      }).start();
    }
  }, [isComplete]); // anim dependencies?

  const resetAnimation = useCallback(() => {
    Animated.spring(anim, { toValue: 0, ...defaultConfig }).start();
  }, [anim]);

  const leftStyle = useMemo(
    () => ({
      flex: 1,
      transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -200] }) }],
    }),
    [anim],
  );

  const rightStyle = useMemo(
    () => ({
      flex: 1,
      transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 200] }) }],
    }),
    [anim],
  );

  return { leftStyle, rightStyle, resetAnimation };
};
