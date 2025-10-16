import React from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { getAuthUser } from "entities/auth";
import { useAuth } from "features/auth/hooks/useAuth";
import { ENavigation, navigate } from "shared/config/navigation";
import {
  AvatarImage,
  Button,
  Card,
  ProgressBar,
  Surface,
  Text,
  Touchable,
} from "shared/ui/paper-kit";

export const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const user = useSelector(getAuthUser);
  const { logout } = useAuth();

  // Mock data - в реальном приложении будет из Redux/API
  const userData = {
    name: user?.displayName || "Friend",
    avatar: user?.photoURL || "https://randomuser.me/api/portraits/men/1.jpg",
    streak: 7,
    level: "Начинающий",
    points: 450,
    nextLevelPoints: 1000,
    todaysProgress: 3,
    dailyGoal: 5,
  };

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Fetch fresh data
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      showsVerticalScrollIndicator={false}>
      {/* Header с приветствием */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text
            variant="headline"
            style={styles.greeting}>
            {`🇰🇷 안녕하세요,\n${userData.name}!`}
          </Text>
          <Text
            variant="body"
            style={styles.subGreeting}>
            {"Продолжайте ваше путешествие в корейский язык"}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Touchable
            style={styles.avatarContainer}
            onPress={() => navigate(ENavigation.PROFILE)}>
            {/* <Text style={styles.avatarText}>👤</Text> */}
            <AvatarImage
              source={{ uri: userData.avatar }}
              size={40}
            />
          </Touchable>
          <Button
            mode="outlined"
            style={styles.logoutButton}
            onPress={() => logout()}
            // contentStyle={styles.logoutButtonContent}
          >
            {"Выйти"}
          </Button>
        </View>
      </View>

      {/* Статистика стрика и прогресса */}
      <Card style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text
              variant="title"
              style={styles.statNumber}>
              {userData.streak}
            </Text>
            <Text
              variant="caption"
              style={styles.statLabel}>
              {"дней подряд"}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text
              variant="title"
              style={styles.statNumber}>
              {userData.points}
            </Text>
            <Text
              variant="caption"
              style={styles.statLabel}>
              {"очков опыта"}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text
              variant="title"
              style={styles.statNumber}>
              {userData.level}
            </Text>
            <Text
              variant="caption"
              style={styles.statLabel}>
              {"текущий уровень"}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text variant="caption">{"Ежедневная цель"}</Text>
            <Text variant="caption">
              {`${userData.todaysProgress}/${userData.dailyGoal} завершено`}
            </Text>
          </View>
          <ProgressBar
            progress={userData.todaysProgress / userData.dailyGoal}
            style={styles.progressBar}
          />
        </View>
      </Card>

      {/* Быстрый старт - рекомендованные активности */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text
            variant="title"
            style={styles.sectionTitle}>
            {"🚀 Быстрый старт"}
          </Text>
        </View>
        <Card style={styles.quickActionsCard}>
          <Touchable
            style={styles.quickAction}
            // onPress={() => navigate("DailyLesson")}
            onPress={() => {}}>
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>📚</Text>
            </View>
            <View style={styles.quickActionText}>
              <Text
                variant="body"
                style={styles.quickActionTitle}>
                {"Урок дня"}
              </Text>
              <Text
                variant="caption"
                style={styles.quickActionSubtitle}>
                {"Новые слова и грамматика"}
              </Text>
            </View>
            <View style={styles.quickActionBadge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          </Touchable>

          <View style={styles.divider} />

          <Touchable
            style={styles.quickAction}
            // onPress={() => navigate("Practice")}
            onPress={() => {}}>
            <View style={styles.quickActionIcon}>
              <Text style={styles.quickActionEmoji}>💬</Text>
            </View>
            <View style={styles.quickActionText}>
              <Text
                variant="body"
                style={styles.quickActionTitle}>
                {"Практика речи"}
              </Text>
              <Text
                variant="caption"
                style={styles.quickActionSubtitle}>
                {"Тренировка произношения"}
              </Text>
            </View>
          </Touchable>

          <View style={styles.divider} />

          <Touchable
            style={styles.quickAction}
            // onPress={() => navigate("Review")}
            onPress={() => {}}>
            <View style={[styles.quickActionIcon, { backgroundColor: "#4CAF50" + "20" }]}>
              <Text style={styles.quickActionEmoji}>🔄</Text>
            </View>
            <View style={styles.quickActionText}>
              <Text
                variant="body"
                style={styles.quickActionTitle}>
                {"Повторение"}
              </Text>
              <Text
                variant="caption"
                style={styles.quickActionSubtitle}>
                {"15 слов для повторения"}
              </Text>
            </View>
          </Touchable>
        </Card>
      </View>

      {/* Roadmap прогресса */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text
            variant="title"
            style={styles.sectionTitle}>
            {"🗺️ Ваш путь обучения"}
          </Text>
          <Touchable onPress={() => navigate(ENavigation.ROADMAP)}>
            <Text
              variant="caption"
              style={styles.seeAllText}>
              {"Подробнее"}
            </Text>
          </Touchable>
        </View>

        <Card style={styles.roadmapCard}>
          <View style={styles.roadmapItem}>
            <View style={styles.roadmapIndicator}>
              <View style={[styles.roadmapDot, styles.roadmapDotCompleted]} />
              <View style={styles.roadmapLine} />
            </View>
            <View style={styles.roadmapContent}>
              <Text
                variant="body"
                style={styles.roadmapTitle}>
                {"Хангыль: Основы"}
              </Text>
              <Text
                variant="caption"
                style={styles.roadmapStatus}>
                {"Завершено • 40/40"}
              </Text>
            </View>
          </View>

          <View style={styles.roadmapItem}>
            <View style={styles.roadmapIndicator}>
              <View style={[styles.roadmapDot, styles.roadmapDotCurrent]} />
              <View style={styles.roadmapLine} />
            </View>
            <View style={styles.roadmapContent}>
              <Text
                variant="body"
                style={styles.roadmapTitle}>
                {"Базовые фразы"}
              </Text>
              <Text
                variant="caption"
                style={styles.roadmapStatus}>
                {"В процессе • 12/25"}
              </Text>
              <ProgressBar
                progress={12 / 25}
                style={styles.roadmapProgress}
              />
            </View>
          </View>

          <View style={styles.roadmapItem}>
            <View style={styles.roadmapIndicator}>
              <View style={[styles.roadmapDot, styles.roadmapDotUpcoming]} />
            </View>
            <View style={styles.roadmapContent}>
              <Text
                variant="body"
                style={styles.roadmapTitle}>
                {"Повседневные диалоги"}
              </Text>
              <Text
                variant="caption"
                style={styles.roadmapStatus}>
                {"Доступно скоро"}
              </Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Статистика обучения */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text
            variant="title"
            style={styles.sectionTitle}>
            {"📊 Ваша статистика"}
          </Text>
        </View>
        <View style={styles.statsGrid}>
          <Surface style={styles.metricCard}>
            <Text
              variant="title"
              style={styles.metricNumber}>
              42
            </Text>
            <Text
              variant="caption"
              style={styles.metricLabel}>
              {"выученных слов"}
            </Text>
          </Surface>

          <Surface style={styles.metricCard}>
            <Text
              variant="title"
              style={styles.metricNumber}>
              15
            </Text>
            <Text
              variant="caption"
              style={styles.metricLabel}>
              {"изученных тем"}
            </Text>
          </Surface>

          <Surface style={styles.metricCard}>
            <Text
              variant="title"
              style={styles.metricNumber}>
              87%
            </Text>
            <Text
              variant="caption"
              style={styles.metricLabel}>
              {"точность"}
            </Text>
          </Surface>

          <Surface style={styles.metricCard}>
            <Text
              variant="title"
              style={styles.metricNumber}>
              {"5ч 20м"}
            </Text>
            <Text
              variant="caption"
              style={styles.metricLabel}>
              {"общее время"}
            </Text>
          </Surface>
        </View>
      </View>

      {/* Мотивационная цитата */}
      <Card style={styles.quoteCard}>
        <Text style={styles.quoteSymbol}>{"“"}</Text>
        <Text
          variant="body"
          style={styles.quoteText}>
          {"Путешествие в тысячу миль начинается с первого шага."}
        </Text>
        <Text
          variant="caption"
          style={styles.quoteAuthor}>
          {"Корейская пословица"}
        </Text>
        <Text style={styles.quoteSymbolEnd}>{"“"}</Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerContent: {
    flex: 1,
    marginRight: 16,
  },
  headerActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  logoutButton: {
    minWidth: 60,
    height: 36,
    alignItems: "center",
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  // avatarText: {
  //   fontSize: 20,
  // },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
  },
  subGreeting: {
    marginTop: 4,
  },

  statsCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontWeight: "700",
    fontSize: 18,
  },
  statLabel: {
    marginTop: 4,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  progressSection: {
    paddingTop: 16,
    borderTopWidth: 1,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  seeAllText: {
    fontWeight: "500",
  },
  quickActionsCard: {
    marginHorizontal: 24,
    borderRadius: 16,
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  quickActionEmoji: {
    fontSize: 20,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontWeight: "500",
  },
  quickActionSubtitle: {
    marginTop: 2,
  },
  quickActionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  roadmapCard: {
    marginHorizontal: 24,
    borderRadius: 16,
  },
  roadmapItem: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  roadmapIndicator: {
    alignItems: "center",
    width: 40,
  },
  roadmapDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  roadmapDotCompleted: {},
  roadmapDotCurrent: {
    borderWidth: 3,
  },
  roadmapDotUpcoming: {},
  roadmapLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  roadmapContent: {
    flex: 1,
    paddingRight: 16,
  },
  roadmapTitle: {
    fontWeight: "500",
  },
  roadmapStatus: {
    marginTop: 2,
  },
  roadmapProgress: {
    marginTop: 8,
    height: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  metricCard: {
    width: "48%",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  metricNumber: {
    fontWeight: "700",
    fontSize: 20,
  },
  metricLabel: {
    textAlign: "center",
    marginTop: 4,
  },
  quoteCard: {
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 16,
    alignItems: "center",
    padding: 24,
  },
  quoteSymbol: {
    fontSize: 32,
    position: "absolute",
    left: 20,
    top: 5,
  },
  quoteSymbolEnd: {
    fontSize: 32,
    position: "absolute",
    right: 20,
    bottom: 0,
  },
  quoteText: {
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 22,
  },
  quoteAuthor: {
    marginTop: 8,
    textAlign: "center",
  },
});

export default HomeScreen;
