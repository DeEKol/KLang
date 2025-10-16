import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Switch } from "react-native-paper";
import Animated, {
  FadeInUp,
  LightSpeedInLeft,
  LinearTransition,
  SlideInRight,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { getAuthUser } from "entities/auth";
import { useAuth } from "features/auth/hooks/useAuth";
import { Button, Card, Surface, Text, Touchable } from "shared/ui/paper-kit";

import { profileStrings } from "./profile.i18n";

const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const AnimatedCard = Animated.createAnimatedComponent(Card);

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const user = useSelector(getAuthUser);

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    soundEffects: true,
    vibration: true,
  });

  // Mock data
  const userStats = {
    streak: 7,
    level: "Начинающий",
    nextLevel: "Элементарный",
    wordsLearned: 42,
    grammarLessons: 15,
    practiceSessions: 28,
    accuracy: 87,
    timeSpent: "5ч 20м",
    joinDate: "15 января 2024",
  };

  const achievements = [
    {
      id: 1,
      name: profileStrings.firstSteps,
      desc: profileStrings.firstStepsDesc,
      completed: true,
      icon: "🎯",
    },
    {
      id: 2,
      name: profileStrings.consistentLearner,
      desc: profileStrings.consistentLearnerDesc,
      completed: true,
      icon: "🔥",
    },
    {
      id: 3,
      name: profileStrings.vocabularyMaster,
      desc: profileStrings.vocabularyMasterDesc,
      completed: false,
      icon: "📚",
    },
    {
      id: 4,
      name: profileStrings.grammarGuru,
      desc: profileStrings.grammarGuruDesc,
      completed: false,
      icon: "🧠",
    },
    {
      id: 5,
      name: profileStrings.speedDemon,
      desc: profileStrings.speedDemonDesc,
      completed: true,
      icon: "⚡",
    },
  ];

  const handleLogout = () => {
    Alert.alert("Подтверждение", "Вы уверены, что хотите выйти?", [
      { text: "Отмена", style: "cancel" },
      { text: "Выйти", style: "destructive", onPress: logout },
    ]);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <AnimatedSurface
        entering={FadeInUp.duration(600)}
        style={styles.header}>
        <View style={styles.avatarSection}>
          <Avatar.Image
            size={100}
            source={{ uri: user?.photoURL || "https://randomuser.me/api/portraits/men/1.jpg" }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text
              variant="headline"
              style={styles.userName}>
              {user?.displayName || "Анна Ким"}
            </Text>
            <Text
              variant="body"
              style={styles.userEmail}>
              {user?.email || "anna@example.com"}
            </Text>
            <Text
              variant="caption"
              style={styles.memberSince}>
              {profileStrings.memberSince} {userStats.joinDate}
            </Text>
          </View>
        </View>

        <Button
          mode="outlined"
          style={styles.editButton}
          onPress={() => {}}>
          {profileStrings.actions.editProfile}
        </Button>
      </AnimatedSurface>

      {/* Statistics */}
      <AnimatedCard
        entering={FadeInUp.duration(600).delay(100)}
        style={styles.statsCard}>
        <Text
          variant="title"
          style={styles.sectionTitle}>
          {profileStrings.statistics}
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text
              variant="headline"
              style={styles.statNumber}>
              {userStats.streak}
            </Text>
            <Text
              variant="caption"
              style={styles.statLabel}>
              {profileStrings.learningStreak}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text
              variant="headline"
              style={styles.statNumber}>
              {userStats.wordsLearned}
            </Text>
            <Text
              variant="caption"
              style={styles.statLabel}>
              {profileStrings.wordsLearned}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text
              variant="headline"
              style={styles.statNumber}>
              {userStats.accuracy}%
            </Text>
            <Text
              variant="caption"
              style={styles.statLabel}>
              {profileStrings.accuracy}
            </Text>
          </View>
        </View>

        <View style={styles.levelSection}>
          <View>
            <Text
              variant="body"
              style={styles.levelLabel}>
              {profileStrings.currentLevel}
            </Text>
            <Text
              variant="title"
              style={styles.levelValue}>
              {userStats.level}
            </Text>
          </View>
          <View style={styles.levelProgress}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, {}]} />
            </View>
            <Text
              variant="caption"
              style={styles.nextLevel}>
              {profileStrings.nextLevel}: {userStats.nextLevel}
            </Text>
          </View>
        </View>
      </AnimatedCard>

      {/* Settings */}
      <AnimatedCard
        entering={FadeInUp.duration(600).delay(200)}
        style={styles.settingsCard}>
        <Text
          variant="title"
          style={styles.sectionTitle}>
          {profileStrings.settings}
        </Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text
              variant="body"
              style={styles.settingTitle}>
              {profileStrings.notifications}
            </Text>
            <Text
              variant="caption"
              style={styles.settingDesc}>
              {"Уведомления о уроках и прогрессе"}
            </Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={() => toggleSetting("notifications")}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text
              variant="body"
              style={styles.settingTitle}>
              {profileStrings.soundEffects}
            </Text>
            <Text
              variant="caption"
              style={styles.settingDesc}>
              {"Звуки при взаимодействии"}
            </Text>
          </View>
          <Switch
            value={settings.soundEffects}
            onValueChange={() => toggleSetting("soundEffects")}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text
              variant="body"
              style={styles.settingTitle}>
              {profileStrings.vibration}
            </Text>
            <Text
              variant="caption"
              style={styles.settingDesc}>
              {"Вибрация при действиях"}
            </Text>
          </View>
          <Switch
            value={settings.vibration}
            onValueChange={() => toggleSetting("vibration")}
          />
        </View>
      </AnimatedCard>

      {/* Achievements */}
      <AnimatedCard
        entering={FadeInUp.duration(600).delay(300)}
        style={styles.achievementsCard}>
        <Text
          variant="title"
          style={styles.sectionTitle}>
          {profileStrings.achievements}
        </Text>

        {achievements.map((achievement, index) => (
          <Animated.View
            key={achievement.id}
            entering={SlideInRight.duration(400).delay(index * 100)}
            layout={LinearTransition.springify()}
            style={styles.achievementItem}>
            <View
              style={[
                styles.achievementIcon,
                !achievement.completed && styles.achievementIconLocked,
              ]}>
              <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
            </View>
            <View style={styles.achievementInfo}>
              <Text
                variant="body"
                style={{
                  ...styles.achievementTitle,
                  ...(!achievement.completed ? styles.achievementTitleLocked : {}),
                }}>
                {achievement.name}
              </Text>
              <Text
                variant="caption"
                style={styles.achievementDesc}>
                {achievement.desc}
              </Text>
            </View>
            <View
              style={[
                styles.achievementStatus,
                achievement.completed ? styles.statusCompleted : styles.statusLocked,
              ]}>
              <Text style={styles.statusText}>{achievement.completed ? "🎉" : "🔒"}</Text>
            </View>
          </Animated.View>
        ))}
      </AnimatedCard>

      {/* Logout Button */}
      <Animated.View
        entering={LightSpeedInLeft.duration(500).delay(400)}
        style={styles.logoutSection}>
        <Button
          mode="outlined"
          style={styles.logoutButton}
          onPress={handleLogout}>
          {profileStrings.actions.logout}
        </Button>
      </Animated.View>
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
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    elevation: 4,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  userEmail: {
    opacity: 0.7,
    marginBottom: 4,
  },
  memberSince: {
    opacity: 0.5,
  },
  editButton: {
    alignSelf: "stretch",
  },
  statsCard: {
    padding: 20,
    borderRadius: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    textAlign: "center",
    opacity: 0.7,
  },
  levelSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levelLabel: {
    opacity: 0.7,
    marginBottom: 4,
  },
  levelValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  levelProgress: {
    flex: 1,
    marginLeft: 20,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    // backgroundColor: "rgba(0,0,0,0.1)",
    marginBottom: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "65%",
    borderRadius: 3,
    // backgroundColor: "#0047AB",
  },
  nextLevel: {
    opacity: 0.5,
    textAlign: "right",
  },
  settingsCard: {
    padding: 20,
    borderRadius: 20,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    // borderBottomColor: "rgba(0,0,0,0.1)",
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingDesc: {
    opacity: 0.6,
  },
  achievementsCard: {
    padding: 20,
    borderRadius: 20,
    elevation: 2,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    // borderBottomColor: "rgba(0,0,0,0.1)",
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    // backgroundColor: "rgba(0, 71, 171, 0.1)",
  },
  achievementIconLocked: {
    // backgroundColor: "rgba(0,0,0,0.05)",
    opacity: 0.5,
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  achievementTitleLocked: {
    opacity: 0.5,
  },
  achievementDesc: {
    opacity: 0.6,
  },
  achievementStatus: {
    padding: 8,
    borderRadius: 8,
  },
  statusCompleted: {
    // backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  statusLocked: {
    // backgroundColor: "rgba(0,0,0,0.05)",
  },
  statusText: {
    fontSize: 16,
  },
  logoutSection: {
    paddingHorizontal: 20,
  },
  logoutButton: {
    // borderColor: "#FF6B6B",
  },
});

export default ProfileScreen;
