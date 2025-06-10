import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const useOpacityAnimation = (trigger: boolean) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!trigger) return;
    Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 0, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 0, duration: 1000, useNativeDriver: true }),
    ]).start();
  }, [trigger]);
  return anim;
};
