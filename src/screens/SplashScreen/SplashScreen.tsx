import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Canvas, Circle, Group, SweepGradient, vec } from "@shopify/react-native-skia";
import { useThemeTokens } from "entities/theme";
import { Text } from "shared/ui/paper-kit";

/* eslint-disable react-native/no-color-literals */

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onAnimationComplete: () => void;
  isLoading?: boolean;
  progress?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onAnimationComplete,
  isLoading = false,
  progress = 0,
}) => {
  const { colors } = useThemeTokens();
  const { t } = useTranslation("splashScreen");

  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(50);
  const progressOpacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withDelay(
        300,
        withTiming(1.2, {
          duration: 800,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      ),
      withTiming(1, { duration: 300 }),
    );

    logoOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));

    textOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    textTranslateY.value = withDelay(
      800,
      withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      }),
    );

    if (isLoading) {
      progressOpacity.value = withDelay(1200, withTiming(1, { duration: 300 }));
      rotation.value = withTiming(360, {
        duration: 1500,
        easing: Easing.linear,
      });
    }

    const timer = setTimeout(
      () => {
        onAnimationComplete();
      },
      isLoading ? 3000 : 2500,
    );

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    opacity: progressOpacity.value,
  }));

  const AnimatedLogo = () => {
    const center = vec(width / 2, height / 2 - 80);
    const radius = 60;
    const strokeWidth = 4;

    const animatedRotation = useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotation.value}deg` }],
    }));

    // Hex alpha suffixes: 30% = "4D", 10% = "1A"
    const ringColor = colors.accent + "4D";
    const innerFillColor = colors.primary + "1A";
    const gradientColors = [colors.accent, colors.primary, colors.accent];

    return (
      <Animated.View style={[styles.logoContainer, animatedRotation]}>
        <Canvas style={styles.canvas}>
          <Group>
            <Circle
              cx={center.x}
              cy={center.y}
              r={radius}
              style="stroke"
              strokeWidth={strokeWidth}
              color={ringColor}
            />
            <SweepGradient
              c={vec(center.x, center.y)}
              colors={gradientColors}
            />
            <Circle
              cx={center.x}
              cy={center.y}
              r={radius - 2}
              style="stroke"
              strokeWidth={strokeWidth - 1}
            />
          </Group>

          <Circle
            cx={center.x}
            cy={center.y}
            r={radius - 15}
            color={innerFillColor}
          />
        </Canvas>

        <View style={[styles.koreanSymbol, { backgroundColor: colors.surface + "E6" }]}>
          <Text style={{ ...styles.koreanText, color: colors.primary }}>{"한"}</Text>
        </View>
      </Animated.View>
    );
  };

  const progressWidth = useSharedValue(0);
  const progressBarStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  const LoadingProgress = () => {
    useEffect(() => {
      if (isLoading) {
        progressWidth.value = withTiming(progress * 200, {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        });
      }
    }, [progress, isLoading]);

    return (
      <Animated.View style={[styles.progressContainer, progressStyle]}>
        <View style={[styles.progressBackground, { backgroundColor: colors.surfaceVariant }]}>
          <Animated.View
            style={[styles.progressFill, progressBarStyle, { backgroundColor: colors.primary }]}
          />
        </View>
        <Text
          variant="caption"
          style={styles.progressText}>
          {t("loading")} {Math.round(progress * 100)}%
        </Text>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.background}>
        <View style={[styles.circle, styles.circle1, { backgroundColor: colors.accent }]} />
        <View style={[styles.circle, styles.circle2, { backgroundColor: colors.primary }]} />
        <View
          style={[styles.circle, styles.circle3, { backgroundColor: colors.primaryContainer }]}
        />
      </View>

      <View style={styles.content}>
        <Animated.View style={logoStyle}>
          <AnimatedLogo />
        </Animated.View>

        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text
            variant="headline"
            style={{ ...styles.appName, color: colors.text }}>
            {t("appName")}
          </Text>
          <Text
            variant="body"
            style={styles.appSubtitle}>
            {t("appSubtitle")}
          </Text>
        </Animated.View>

        {isLoading && <LoadingProgress />}

        <View style={styles.decorations}>
          <Text style={styles.decorationText}>{"✈️"}</Text>
          <Text style={styles.decorationText}>{"📚"}</Text>
          <Text style={styles.decorationText}>{"🎯"}</Text>
        </View>
      </View>

      <Text
        variant="caption"
        style={styles.version}>
        {t("version")} 1.0.0
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  circle: {
    position: "absolute",
    borderRadius: 500,
    opacity: 0.1,
  },
  circle1: {
    width: 300,
    height: 300,
    top: -150,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: -50,
    left: -50,
  },
  circle3: {
    width: 150,
    height: 150,
    top: "40%",
    right: "20%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoContainer: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  canvas: {
    width: 140,
    height: 140,
    position: "absolute",
  },
  koreanSymbol: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  koreanText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  appSubtitle: {
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 20,
  },
  progressContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  progressBackground: {
    width: 200,
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    opacity: 0.6,
  },
  decorations: {
    flexDirection: "row",
    marginTop: 60,
    gap: 20,
  },
  decorationText: {
    fontSize: 24,
    opacity: 0.3,
  },
  version: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    opacity: 0.5,
  },
});

export default SplashScreen;
