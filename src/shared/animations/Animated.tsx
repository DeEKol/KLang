import React from "react";
import Animated, {
  BounceIn,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  LightSpeedInRight,
  PinwheelIn,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  SlideInUp,
  StretchInX,
  type StyleProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";

export type AnimationType =
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "slideInUp"
  | "slideInDown"
  | "slideInLeft"
  | "slideInRight"
  | "zoomIn"
  | "zoomOut"
  | "bounceIn"
  | "lightSpeedIn"
  | "stretchIn"
  | "pinwheelIn";

interface AnimatedProps {
  children: React.ReactNode;
  type?: AnimationType;
  duration?: number;
  delay?: number;
  style?: StyleProps;
  onAnimationEnd?: () => void;
}

const getEnteringAnimation = (type: AnimationType, duration: number, delay: number) => {
  const config = { duration, delay };

  switch (type) {
    case "fadeIn":
      return FadeIn.duration(duration).delay(delay);
    case "fadeInUp":
      return FadeInUp.duration(duration).delay(delay);
    case "fadeInDown":
      return FadeInDown.duration(duration).delay(delay);
    case "fadeInLeft":
      return FadeInLeft.duration(duration).delay(delay);
    case "fadeInRight":
      return FadeInRight.duration(duration).delay(delay);
    case "slideInUp":
      return SlideInUp.duration(duration).delay(delay);
    case "slideInDown":
      return SlideInDown.duration(duration).delay(delay);
    case "slideInLeft":
      return SlideInLeft.duration(duration).delay(delay);
    case "slideInRight":
      return SlideInRight.duration(duration).delay(delay);
    case "zoomIn":
      return ZoomIn.duration(duration).delay(delay);
    case "zoomOut":
      return ZoomOut.duration(duration).delay(delay);
    case "bounceIn":
      return BounceIn.duration(duration).delay(delay);
    case "lightSpeedIn":
      return LightSpeedInRight.duration(duration).delay(delay);
    case "stretchIn":
      return StretchInX.duration(duration).delay(delay);
    case "pinwheelIn":
      return PinwheelIn.duration(duration).delay(delay);
    default:
      return FadeIn.duration(duration).delay(delay);
  }
};

export const AnimatedView: React.FC<AnimatedProps> = ({
  children,
  type = "fadeIn",
  duration = 500,
  delay = 0,
  style,
  onAnimationEnd,
}) => {
  return (
    <Animated.View
      entering={getEnteringAnimation(type, duration, delay)}
      style={style}
      onLayout={onAnimationEnd}>
      {children}
    </Animated.View>
  );
};

// Специализированные анимированные компоненты
export const FadeInView: React.FC<Omit<AnimatedProps, "type">> = (props) => (
  <AnimatedView
    type="fadeIn"
    {...props}
  />
);

export const SlideInRightView: React.FC<Omit<AnimatedProps, "type">> = (props) => (
  <AnimatedView
    type="slideInRight"
    {...props}
  />
);

export const BounceInView: React.FC<Omit<AnimatedProps, "type">> = (props) => (
  <AnimatedView
    type="bounceIn"
    {...props}
  />
);

// Хук для пульсирующей анимации
export const usePulseAnimation = (minScale = 0.95, maxScale = 1.05) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(minScale, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(maxScale, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, []);

  return useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
};

// Хук для дрожащей анимации
export const useShakeAnimation = (intensity = 5) => {
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(intensity, { duration: 50 }),
        withTiming(-intensity, { duration: 100 }),
        withTiming(intensity, { duration: 100 }),
        withTiming(0, { duration: 50 }),
      ),
      -1,
      false,
    );
  }, []);

  return useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
};
