import React from "react";
import { StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

import { animations } from "./assets";

interface ILottieImageProps {
  visible: boolean;
  name: string;
  onAnimationFinish?: () => void;
}

const LottieImage: React.FC<ILottieImageProps> = (props: ILottieImageProps) => {
  // ? Props
  const { visible, name = "", onAnimationFinish } = props;

  // ? Render
  if (!visible) return null;

  return (
    <LottieView
      source={animations[name]}
      autoPlay
      loop
      style={styles.container}
      onAnimationFinish={onAnimationFinish}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    margin: "auto",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});

export { LottieImage };
