import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Canvas, Circle, Group, Skia, SweepGradient, vec } from "@shopify/react-native-skia";
import { Text } from "shared/ui/paper-kit";

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
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(50);
  const progressOpacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  const { t } = useTranslation("splashScreen");

  // Анимация появления логотипа
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

    // Анимация текста
    textOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    textTranslateY.value = withDelay(
      800,
      withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      }),
    );

    // Анимация прогресса (если загрузка)
    if (isLoading) {
      progressOpacity.value = withDelay(1200, withTiming(1, { duration: 300 }));
    }

    // Завершение анимации
    const timer = setTimeout(
      () => {
        onAnimationComplete();
      },
      isLoading ? 3000 : 2500,
    );

    // Анимация вращения (только при загрузке)
    if (isLoading) {
      rotation.value = withTiming(360, {
        duration: 1500,
        easing: Easing.linear,
      });
    }

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

  // Анимированный круговой логотип с Skia
  const AnimatedLogo = () => {
    const center = vec(width / 2, height / 2 - 80);
    const radius = 60;
    const strokeWidth = 4;

    const animatedRotation = useAnimatedStyle(() => ({
      transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
      <Animated.View style={[styles.logoContainer, animatedRotation]}>
        <Canvas style={styles.canvas}>
          <Group>
            {/* Внешнее кольцо */}
            <Circle
              cx={center.x}
              cy={center.y}
              r={radius}
              style="stroke"
              strokeWidth={strokeWidth}
              color="rgba(255, 107, 107, 0.3)"
            />

            {/* Вращающийся градиент */}
            <SweepGradient
              c={vec(center.x, center.y)}
              colors={["#FF6B6B", "#0047AB", "#FF6B6B"]}
            />
            <Circle
              cx={center.x}
              cy={center.y}
              r={radius - 2}
              style="stroke"
              strokeWidth={strokeWidth - 1}
            />
          </Group>

          {/* Внутренний круг */}
          <Circle
            cx={center.x}
            cy={center.y}
            r={radius - 15}
            color="rgba(0, 71, 171, 0.1)"
          />
        </Canvas>

        {/* Корейский символ в центре */}
        <View style={styles.koreanSymbol}>
          <Text style={styles.koreanText}>{"한"}</Text>
        </View>
      </Animated.View>
    );
  };

  const progressWidth = useSharedValue(0);
  const progressBarStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  // Компонент прогресс-бара
  const LoadingProgress = () => {
    useEffect(() => {
      if (isLoading) {
        console.log("progress!!", progress);

        progressWidth.value = withTiming(progress * 200, {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        });
      }
    }, [progress, isLoading]);

    return (
      <Animated.View style={[styles.progressContainer, progressStyle]}>
        <View style={styles.progressBackground}>
          <Animated.View style={[styles.progressFill, progressBarStyle]} />
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
    <View style={styles.container}>
      {/* Анимированный фон */}
      <View style={styles.background}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      {/* Основной контент */}
      <View style={styles.content}>
        {/* Логотип с анимацией */}
        <Animated.View style={logoStyle}>
          <AnimatedLogo />
        </Animated.View>

        {/* Текст приложения */}
        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text
            variant="headline"
            style={styles.appName}>
            {t("appName")}
          </Text>
          <Text
            variant="body"
            style={styles.appSubtitle}>
            {t("appSubtitle")}
          </Text>
        </Animated.View>

        {/* Прогресс загрузки */}
        {isLoading && <LoadingProgress />}

        {/* Декоративные элементы */}
        <View style={styles.decorations}>
          <Text style={styles.decorationText}>{"✈️"}</Text>
          <Text style={styles.decorationText}>{"📚"}</Text>
          <Text style={styles.decorationText}>{"🎯"}</Text>
        </View>
      </View>

      {/* Версия приложения */}
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
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#FF6B6B",
    top: -150,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    backgroundColor: "#0047AB",
    bottom: -50,
    left: -50,
  },
  circle3: {
    width: 150,
    height: 150,
    backgroundColor: "#4CAF50",
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
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
    color: "#0047AB",
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
    color: "#1A1A1A",
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
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0047AB",
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
