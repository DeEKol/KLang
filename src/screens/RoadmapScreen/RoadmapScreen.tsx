import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  FadeInRight,
  LinearTransition,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Canvas, LinearGradient, Path, Skia, vec } from "@shopify/react-native-skia";
import { key } from "shared/helpers/generateKey";
import { Button, Card, Surface, Text, Touchable } from "shared/ui/paper-kit";

const { width: screenWidth } = Dimensions.get("window");
const AnimatedSurface = Animated.createAnimatedComponent(Surface);

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  level: string;
  progress: number;
  status: "completed" | "current" | "upcoming" | "locked";
  modules: number;
  completedModules: number;
  color: string;
}

export const RoadmapScreen: React.FC = () => {
  const { t } = useTranslation("roadmapScreen");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const roadmapData: RoadmapItem[] = [
    {
      id: "1",
      title: t("modules.hangeul"),
      description: "Изучение корейского алфавита и основных звуков",
      level: t("levels.beginner"),
      progress: 1,
      status: "completed",
      modules: 5,
      completedModules: 5,
      color: "#4CAF50",
    },
    {
      id: "2",
      title: t("modules.greetings"),
      description: "Основные приветствия и повседневные фразы",
      level: t("levels.beginner"),
      progress: 0.8,
      status: "current",
      modules: 8,
      completedModules: 6,
      color: "#2196F3",
    },
    {
      id: "3",
      title: t("modules.dailyLife"),
      description: "Фразы для повседневного общения",
      level: t("levels.elementary"),
      progress: 0,
      status: "upcoming",
      modules: 10,
      completedModules: 0,
      color: "#FF9800",
    },
    {
      id: "4",
      title: t("modules.food"),
      description: "Еда, рестораны и корейская кухня",
      level: t("levels.elementary"),
      progress: 0,
      status: "locked",
      modules: 8,
      completedModules: 0,
      color: "#9C27B0",
    },
    {
      id: "5",
      title: t("modules.travel"),
      description: "Путешествия по Корее и транспорт",
      level: t("levels.intermediate"),
      progress: 0,
      status: "locked",
      modules: 12,
      completedModules: 0,
      color: "#F44336",
    },
  ];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const getStatusConfig = (status: RoadmapItem["status"]) => {
    switch (status) {
      case "completed":
        return {
          label: t("completed"),
          color: "#4CAF50",
          bgColor: "rgba(76, 175, 80, 0.1)",
        };
      case "current":
        return {
          label: t("inProgress"),
          color: "#2196F3",
          bgColor: "rgba(33, 150, 243, 0.1)",
        };
      case "upcoming":
        return {
          label: t("upcoming"),
          color: "#FF9800",
          bgColor: "rgba(255, 152, 0, 0.1)",
        };
      case "locked":
        return {
          label: t("locked"),
          color: "#9E9E9E",
          bgColor: "rgba(158, 158, 158, 0.1)",
        };
    }
  };

  const ProgressArc = ({ progress, color }: { progress: number; color: string }) => {
    const radius = 20;
    const strokeWidth = 4;
    const size = radius * 2 + strokeWidth;

    const path = Skia.Path.Make();
    const center = vec(radius + strokeWidth / 2, radius + strokeWidth / 2);

    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + 2 * Math.PI * progress;

    path.addArc(
      { x: strokeWidth / 2, y: strokeWidth / 2, width: radius * 2, height: radius * 2 },
      startAngle * (180 / Math.PI),
      (endAngle - startAngle) * (180 / Math.PI),
    );

    return (
      <Canvas style={{ width: size, height: size }}>
        <Path
          path={path}
          color={color}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
        />
      </Canvas>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <Animated.View
        entering={SlideInUp.duration(400)}
        style={styles.header}>
        <Text
          variant="headline"
          style={styles.title}>
          {t("title")}
        </Text>
        <Text
          variant="body"
          style={styles.subtitle}>
          {t("subtitle")}
        </Text>

        <Surface style={styles.progressOverview}>
          <View style={styles.overviewItem}>
            <Text
              variant="title"
              style={styles.overviewNumber}>
              45%
            </Text>
            <Text
              variant="caption"
              style={styles.overviewLabel}>
              {t("currentProgress")}
            </Text>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewItem}>
            <Text
              variant="title"
              style={styles.overviewNumber}>
              2/5
            </Text>
            <Text
              variant="caption"
              style={styles.overviewLabel}>
              {"Уровни"}
            </Text>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewItem}>
            <Text
              variant="title"
              style={styles.overviewNumber}>
              11
            </Text>
            <Text
              variant="caption"
              style={styles.overviewLabel}>
              {"Модули"}
            </Text>
          </View>
        </Surface>
      </Animated.View>

      {/* Roadmap Timeline */}
      <View style={styles.timeline}>
        {roadmapData.map((item, index) => {
          const statusConfig = getStatusConfig(item.status);
          const isExpanded = expandedSection === item.id;

          return (
            <Animated.View
              key={item.id}
              entering={FadeInRight.duration(500).delay(index * 150)}
              layout={LinearTransition.springify()}>
              {/* Timeline Connector */}
              {index > 0 && (
                <View style={[styles.connector, { backgroundColor: statusConfig.color }]} />
              )}

              {/* Roadmap Item */}
              <Touchable
                style={styles.roadmapItem}
                onPress={() => toggleSection(item.id)}>
                {/* Progress Indicator */}
                <View style={styles.progressIndicator}>
                  <ProgressArc
                    progress={item.progress}
                    color={statusConfig.color}
                  />
                  <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
                </View>

                {/* Content */}
                <View style={styles.roadmapContent}>
                  <View style={styles.roadmapHeader}>
                    <View style={styles.titleSection}>
                      <Text
                        variant="title"
                        style={styles.roadmapTitle}>
                        {item.title}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                        <Text style={styles.statusText}>{statusConfig.label}</Text>
                      </View>
                    </View>
                    <Text
                      variant="caption"
                      style={styles.levelText}>
                      {item.level}
                    </Text>
                  </View>

                  <Text
                    variant="body"
                    style={styles.roadmapDesc}>
                    {item.description}
                  </Text>

                  {/* Progress Bar */}
                  <View style={styles.moduleProgress}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${(item.completedModules / item.modules) * 100}%`,
                            backgroundColor: statusConfig.color,
                          },
                        ]}
                      />
                    </View>
                    <Text
                      variant="caption"
                      style={styles.progressText}>
                      {`${item.completedModules}/${item.modules} модулей`}
                    </Text>
                  </View>

                  {/* Expandable Content */}
                  {isExpanded && (
                    <Animated.View
                      entering={ZoomIn.duration(300)}
                      style={styles.expandedContent}>
                      <View style={styles.modulesList}>
                        <Text
                          variant="body"
                          style={styles.modulesTitle}>
                          {"Модули курса:"}
                        </Text>
                        {Array.from({ length: item.modules }).map((_, i) => (
                          <View
                            key={key("module-item")}
                            style={styles.moduleItem}>
                            <View
                              style={[
                                styles.moduleIcon,
                                i < item.completedModules && {
                                  backgroundColor: statusConfig.color,
                                },
                              ]}>
                              <Text style={styles.moduleIconText}>
                                {i < item.completedModules ? "✓" : i + 1}
                              </Text>
                            </View>
                            <Text
                              variant="caption"
                              style={styles.moduleText}>
                              {"Модуль {i + 1}"}{" "}
                              {i < item.completedModules ? "- Завершён" : "- Доступен"}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {item.status === "current" && (
                        <Button
                          mode="contained"
                          style={styles.continueButton}
                          onPress={() => {}}>
                          {"Продолжить обучение"}
                        </Button>
                      )}
                    </Animated.View>
                  )}
                </View>
              </Touchable>
            </Animated.View>
          );
        })}
      </View>

      {/* Motivation Section */}
      <AnimatedSurface
        entering={FadeInRight.duration(600).delay(800)}
        style={styles.motivationCard}>
        <Text
          variant="title"
          style={styles.motivationTitle}>
          {"🎯 Достигните свободного владения!"}
        </Text>
        <Text
          variant="body"
          style={styles.motivationText}>
          {
            "Продолжайте регулярно заниматься и скоро вы сможете свободно общаться на корейском языке. Каждый пройденный урок приближает вас к цели!"
          }
        </Text>
      </AnimatedSurface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 20,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 24,
  },
  progressOverview: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    width: "100%",
  },
  overviewItem: {
    flex: 1,
    alignItems: "center",
  },
  overviewNumber: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  overviewLabel: {
    opacity: 0.7,
    textAlign: "center",
  },
  overviewDivider: {
    width: 1,
    height: 30,
    // backgroundColor: "rgba(0,0,0,0.1)",
  },
  timeline: {
    position: "relative",
  },
  connector: {
    width: 2,
    height: 20,
    alignSelf: "center",
    marginLeft: 29, // Align with progress indicator
  },
  roadmapItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  progressIndicator: {
    position: "relative",
    alignItems: "center",
    marginRight: 16,
  },
  statusDot: {
    position: "absolute",
    top: 22,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  roadmapContent: {
    flex: 1,
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    // elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roadmapHeader: {
    marginBottom: 8,
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  roadmapTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  levelText: {
    opacity: 0.6,
  },
  roadmapDesc: {
    opacity: 0.7,
    marginBottom: 12,
    lineHeight: 18,
  },
  moduleProgress: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    opacity: 0.6,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  modulesList: {
    marginBottom: 16,
  },
  modulesTitle: {
    fontWeight: "600",
    marginBottom: 8,
  },
  moduleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  moduleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    // backgroundColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  moduleIconText: {
    fontSize: 12,
    fontWeight: "600",
    // color: "white",
  },
  moduleText: {
    opacity: 0.7,
  },
  continueButton: {
    marginTop: 8,
  },
  motivationCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  motivationText: {
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 20,
  },
});

export default RoadmapScreen;
