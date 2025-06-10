import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const useScaleAnimation = (active: boolean) => {
  const anim = useRef(new Animated.Value(active ? 1.1 : 1)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: active ? 1.1 : 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [active]);
  return anim;
};
