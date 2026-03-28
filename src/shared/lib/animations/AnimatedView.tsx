import React from "react";
import Animated, {
  BounceIn,
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
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";

import type { AnimationType } from "./types";

interface AnimatedViewProps {
  children: React.ReactNode;
  type?: AnimationType;
  duration?: number;
  delay?: number;
  style?: StyleProps;
  onAnimationEnd?: () => void;
}

const getEnteringAnimation = (type: AnimationType, duration: number, delay: number) => {
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

export const AnimatedView: React.FC<AnimatedViewProps> = ({
  children,
  type = "fadeIn",
  duration = 500,
  delay = 0,
  style,
  onAnimationEnd,
}) => (
  <Animated.View
    entering={getEnteringAnimation(type, duration, delay)}
    style={style}
    onLayout={onAnimationEnd}>
    {children}
  </Animated.View>
);

export const FadeInView: React.FC<Omit<AnimatedViewProps, "type">> = (props) => (
  <AnimatedView
    type="fadeIn"
    {...props}
  />
);

export const SlideInRightView: React.FC<Omit<AnimatedViewProps, "type">> = (props) => (
  <AnimatedView
    type="slideInRight"
    {...props}
  />
);

export const BounceInView: React.FC<Omit<AnimatedViewProps, "type">> = (props) => (
  <AnimatedView
    type="bounceIn"
    {...props}
  />
);
