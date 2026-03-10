import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
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
  const val = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(val, {
      toValue: focused ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [focused, val]);

  const scale = val.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.25],
  });

  const translateY = val.interpolate({
    inputRange: [0, 10],
    outputRange: [0, -2],
  });

  const animatedStyle = {
    transform: [{ scale }, { translateY }],
  };

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
