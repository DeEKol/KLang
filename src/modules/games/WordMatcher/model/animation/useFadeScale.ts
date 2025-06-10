import { useEffect, useMemo, useRef } from "react";
import { Animated } from "react-native";

export const useFadeScale = (visible: boolean) => {
  const anim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const style = useMemo(
    () => ({
      opacity: anim,
      transform: [{ scale: anim }],
    }),
    [anim],
  );

  return style;
};
