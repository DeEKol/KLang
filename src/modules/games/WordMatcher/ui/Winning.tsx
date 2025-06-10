import React, { useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Svg, { G, Path } from "react-native-svg";

interface ICelebrationIconProps {
  size?: number;
  color?: string;
}

const CelebrationIcon = ({ size = 100, color = "#FFD700" }: ICelebrationIconProps) => (
  <Svg
    viewBox="0 0 512 512"
    width={size}
    height={size}>
    <G fill={color}>
      <Path d="M499.9 357.3l-48-112c-5.1-12.1-17-19.3-29.9-19.3H336V64h32c8.8 0 16-7.2 16-16V16c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32v162.7H90c-12.9 0-24.8 7.2-29.9 19.3l-48 112C5.8 372.6 16.2 384 29 384h454c12.8 0 23.2-11.4 19.9-26.7zM192 64h128v160H192V64zM53.5 336L90 240h332l36.5 96H53.5z" />
      <Path d="M256 408c-30.9 0-56 25.1-56 56h112c0-30.9-25.1-56-56-56zM120 408c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24zm272 0c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z" />
    </G>
  </Svg>
);

const Winning = ({ isMatchComplete }: { isMatchComplete: boolean }) => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  Animated.timing(spinAnim, {
    toValue: 1,
    duration: 1000,
    useNativeDriver: true,
  }).start(() => {
    spinAnim.setValue(0);
  });

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    isMatchComplete && (
      <View style={styles.completeContainer}>
        {/* <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <CelebrationIcon size={120} />
      </Animated.View> */}
        <Text style={styles.completeText}>{"All Matched! 🎉"}</Text>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  completeContainer: {
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  completeText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2ecc71",
    marginTop: 16,
  },
});

export default Winning;
