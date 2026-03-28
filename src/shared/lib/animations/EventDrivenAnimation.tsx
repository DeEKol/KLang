import React, { useEffect } from "react";
import type { AnimatedStyle, StyleProps } from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { animationEventEmitter } from "./AnimationEventEmitter";

type AnimationType = "fade" | "scale" | "slide";

interface EventDrivenAnimationProps {
  animationType: AnimationType;
  children: React.ReactNode;
  style?: AnimatedStyle<StyleProps>;
}

/**
 * Wrapper that plays an animation in response to `animationEventEmitter` events.
 * Use `animationEventEmitter.emit("start")` to trigger and `"reset"` to reverse.
 */
export const EventDrivenAnimation: React.FC<EventDrivenAnimationProps> = ({
  animationType,
  children,
  style,
}) => {
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    switch (animationType) {
      case "fade":
        return { opacity: progress.value };
      case "scale":
        return { transform: [{ scale: progress.value }] };
      case "slide":
        return { transform: [{ translateX: progress.value * 100 }] };
      default:
        return {};
    }
  });

  useEffect(() => {
    const unsubscribe = animationEventEmitter.subscribe((event) => {
      progress.value =
        event === "start" ? withSpring(1, { damping: 10 }) : withTiming(0, { duration: 300 });
    });
    return unsubscribe;
  }, [progress]);

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
};
