import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import type { AnimatedStyle, StyleProps } from "react-native-reanimated";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { animationEventEmitter } from "../AnimationEventEmitter";

type AnimationType = "fade" | "scale" | "slide";

interface EventDrivenAnimationProps {
  animationType: AnimationType;
  children: React.ReactNode;
  style?: AnimatedStyle<StyleProps>;
}

const EventDrivenAnimation = ({ animationType, children, style }: EventDrivenAnimationProps) => {
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

export const AnimationExample = ({ children }: React.PropsWithChildren) => {
  setTimeout(() => {
    animationEventEmitter.emit("start");
  }, 3000);

  return (
    <View style={styles.container}>
      <EventDrivenAnimation
        animationType="slide"
        style={styles.animatedBox}>
        {children}
      </EventDrivenAnimation>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  animatedBox: {
    width: 100,
    height: 100,
    backgroundColor: "tomato",
    margin: 10,
  },
});
