import React, { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import MaterialDesignIcons, {
  type MaterialDesignIconsIconName,
} from "@react-native-vector-icons/material-design-icons";

interface Props {
  name: MaterialDesignIconsIconName;
  focused: boolean;
  color: string;
  size?: number;
}

export default function AnimatedIcon({ name, focused, color, size = 24 }: Props) {
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [focused, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + progress.value * 0.25 }, { translateY: progress.value * -2 }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <MaterialDesignIcons
        name={name}
        color={color}
        size={size}
      />
    </Animated.View>
  );
}
