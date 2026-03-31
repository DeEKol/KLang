import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type TVictoryOverlayProps = {
  visible: boolean;
  onClose: () => void;
};

export const VictoryOverlay: React.FC<TVictoryOverlayProps> = ({ visible, onClose }) => {
  const { t } = useTranslation("sequencesBuilder");
  const scale = useSharedValue(0.2);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.back(2)) });
      opacity.value = withTiming(1, { duration: 300 });
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = 0.2;
      opacity.value = 0;
    }
  }, [visible, scale, opacity, onClose]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <View
      style={styles.victoryOverlay}
      pointerEvents="none">
      <Animated.View style={[styles.victoryCard, animatedStyle]}>
        <Text style={styles.victoryText}>{t("victoryTitle")}</Text>
        <Text style={styles.victorySub}>{t("victorySub")}</Text>
      </Animated.View>
    </View>
  );
};

// Victory colours are intentional branding — not theme tokens
const styles = StyleSheet.create({
  victoryOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  victoryCard: {
    backgroundColor: "#0b2b1f",
    padding: 22,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#2ecc71",
    alignItems: "center",
  },
  victoryText: {
    fontSize: 22,
    color: "#e6fff1",
    fontWeight: "700",
  },
  victorySub: {
    color: "#c9f5d6",
    marginTop: 4,
  },
});
