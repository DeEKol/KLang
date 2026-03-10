import React, { useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { getAuthUser } from "entities/auth";
import type { TThemeMode } from "entities/theme";
import { getThemeMode, themeActions } from "entities/theme";
import { useAuth } from "features/auth/hooks/useAuth";
import { useThemeTokens } from "shared/lib/theme";
import {
  AnimatedView,
  FadeInView,
  // KoreanTiger,
  SlideInRightView,
  Surface,
  Text,
} from "shared/ui/paper-kit";
import {
  SettingAction,
  SettingRadio,
  SettingsSection,
  SettingSwitch,
} from "shared/ui/paper-kit/settings-components";

import { settingsStrings } from "./settings.i18n";

export const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors } = useThemeTokens();
  const themeName = useSelector(getThemeMode);
  const { logout } = useAuth();
  const user = useSelector(getAuthUser);

  // Состояния настроек
  const [settings, setSettings] = useState({
    // Уведомления
    dailyReminders: true,
    studyReminders: true,
    progressUpdates: false,
    soundEffects: true,
    vibration: true,

    // Обучение
    autoPlayAudio: true,
    showRomanization: false,
    reviewEnabled: true,

    // Внешний вид
    theme: themeName ?? "system",
    fontSize: "medium" as "small" | "medium" | "large",
  });

  const [learningGoals, setLearningGoals] = useState({
    dailyMinutes: 15,
    difficulty: "medium" as "easy" | "medium" | "hard",
  });

  // Обработчики изменений
  const handleSettingChange = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    if (key === "theme") {
      const mode: TThemeMode = value === "system" ? null : (value as TThemeMode);
      dispatch(themeActions.changeTheme(mode));
    }
  };

  const handleGoalChange = (key: string, value: unknown) => {
    setLearningGoals((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogout = () => {
    Alert.alert("Выход из аккаунта", "Вы уверены, что хотите выйти? Ваш прогресс будет сохранен.", [
      { text: "Отмена", style: "cancel" },
      { text: "Выйти", style: "destructive", onPress: logout },
    ]);
  };

  const handleRateApp = () => {
    // В реальном приложении здесь будет ссылка на магазин приложений
    Alert.alert("Оценить приложение", "Спасибо за вашу оценку!");
  };

  const handleShareApp = () => {
    // В реальном приложении здесь будет функционал поделиться
    Alert.alert("Поделиться", "Поделитесь приложением с друзьями!");
  };

  const handleFeedback = () => {
    Linking.openURL("mailto:support@korean-learn.com?subject=Обратная связь");
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL("https://korean-learn.com/privacy");
  };

  const handleTermsOfService = () => {
    Linking.openURL("https://korean-learn.com/terms");
  };

  // Опции для выбора темы
  const themeOptions = [
    { label: settingsStrings.themeLight, value: "light" },
    { label: settingsStrings.themeDark, value: "dark" },
    { label: settingsStrings.themeAuto, value: "system" },
  ];

  // Опции для размера шрифта
  const fontSizeOptions = [
    { label: settingsStrings.fontSizeSmall, value: "small" },
    { label: settingsStrings.fontSizeMedium, value: "medium" },
    { label: settingsStrings.fontSizeLarge, value: "large" },
  ];

  // Опции для сложности
  const difficultyOptions = [
    {
      label: settingsStrings.difficultyEasy,
      value: "easy",
      description: "Медленный темп, больше повторений",
    },
    {
      label: settingsStrings.difficultyMedium,
      value: "medium",
      description: "Сбалансированный темп обучения",
    },
    {
      label: settingsStrings.difficultyHard,
      value: "hard",
      description: "Быстрый темп, меньше подсказок",
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {/* Header с анимированным тигром */}
      <FadeInView
        duration={800}
        style={styles.header}>
        <View style={styles.headerContent}>
          {/* <KoreanTiger
            size={80}
            withAnimation={true}
          /> */}
          <View style={styles.headerText}>
            <Text
              variant="headline"
              style={[styles.title, { color: colors.text }]}>
              {settingsStrings.title}
            </Text>
            <Text
              variant="body"
              style={[styles.subtitle, { color: colors.placeholder }]}>
              {settingsStrings.subtitle}
            </Text>
          </View>
        </View>
      </FadeInView>

      {/* Внешний вид */}
      <SettingsSection
        title={settingsStrings.appearance}
        icon="🎨">
        <SlideInRightView
          delay={100}
          duration={500}>
          <SettingRadio
            label={settingsStrings.theme}
            value={settings.theme}
            onValueChange={(value) => handleSettingChange("theme", value)}
            options={themeOptions}
          />
        </SlideInRightView>

        <SlideInRightView
          delay={150}
          duration={500}>
          <SettingRadio
            label={settingsStrings.fontSize}
            value={settings.fontSize}
            onValueChange={(value) => handleSettingChange("fontSize", value)}
            options={fontSizeOptions}
          />
        </SlideInRightView>
      </SettingsSection>

      {/* Уведомления */}
      <SettingsSection
        title={settingsStrings.notifications}
        icon="🔔">
        <SlideInRightView
          delay={200}
          duration={500}>
          <SettingSwitch
            label={settingsStrings.dailyReminders}
            value={settings.dailyReminders}
            onValueChange={(value) => handleSettingChange("dailyReminders", value)}
            description="Напоминания о ежедневной практике"
          />
        </SlideInRightView>

        <SlideInRightView
          delay={250}
          duration={500}>
          <SettingSwitch
            label={settingsStrings.studyReminders}
            value={settings.studyReminders}
            onValueChange={(value) => handleSettingChange("studyReminders", value)}
            description="Напоминания о новых уроках"
          />
        </SlideInRightView>

        <SlideInRightView
          delay={300}
          duration={500}>
          <SettingSwitch
            label={settingsStrings.progressUpdates}
            value={settings.progressUpdates}
            onValueChange={(value) => handleSettingChange("progressUpdates", value)}
            description="Уведомления о достижениях"
          />
        </SlideInRightView>

        <SlideInRightView
          delay={350}
          duration={500}>
          <SettingSwitch
            label={settingsStrings.soundEffects}
            value={settings.soundEffects}
            onValueChange={(value) => handleSettingChange("soundEffects", value)}
            description="Звуки при взаимодействии"
          />
        </SlideInRightView>

        <SlideInRightView
          delay={400}
          duration={500}>
          <SettingSwitch
            label={settingsStrings.vibration}
            value={settings.vibration}
            onValueChange={(value) => handleSettingChange("vibration", value)}
            description="Вибрация при действиях"
          />
        </SlideInRightView>
      </SettingsSection>

      {/* Обучение */}
      <SettingsSection
        title={settingsStrings.learning}
        icon="📚">
        <SlideInRightView
          delay={450}
          duration={500}>
          <SettingAction
            label={settingsStrings.dailyGoal}
            value={`${learningGoals.dailyMinutes} ${settingsStrings.minutes}`}
            onPress={() => {
              // Навигация к экрану изменения цели
              Alert.alert("Ежедневная цель", "Измените вашу ежедневную цель обучения");
            }}
            icon="🎯"
          />
        </SlideInRightView>

        <SlideInRightView
          delay={500}
          duration={500}>
          <SettingRadio
            label={settingsStrings.difficulty}
            value={learningGoals.difficulty}
            onValueChange={(value) => handleGoalChange("difficulty", value)}
            options={difficultyOptions}
          />
        </SlideInRightView>

        <SlideInRightView
          delay={550}
          duration={500}>
          <SettingSwitch
            label={settingsStrings.autoPlayAudio}
            value={settings.autoPlayAudio}
            onValueChange={(value) => handleSettingChange("autoPlayAudio", value)}
            description="Автоматически воспроизводить корейское произношение"
          />
        </SlideInRightView>

        <SlideInRightView
          delay={600}
          duration={500}>
          <SettingSwitch
            label={settingsStrings.showRomanization}
            value={settings.showRomanization}
            onValueChange={(value) => handleSettingChange("showRomanization", value)}
            description="Показывать романизацию корейских слов"
          />
        </SlideInRightView>

        <SlideInRightView
          delay={650}
          duration={500}>
          <SettingSwitch
            label={settingsStrings.reviewEnabled}
            value={settings.reviewEnabled}
            onValueChange={(value) => handleSettingChange("reviewEnabled", value)}
            description="Автоматическое повторение пройденного материала"
          />
        </SlideInRightView>
      </SettingsSection>

      {/* Аккаунт */}
      <SettingsSection
        title={settingsStrings.account}
        icon="👤">
        <SlideInRightView
          delay={700}
          duration={500}>
          <SettingAction
            label={settingsStrings.profile}
            value={user?.displayName || "Анна Ким"}
            onPress={() => navigation.navigate("Profile")}
            icon="👤"
          />
        </SlideInRightView>

        <SlideInRightView
          delay={750}
          duration={500}>
          <SettingAction
            label={settingsStrings.subscription}
            value={settingsStrings.subscriptionFree}
            onPress={() => {
              Alert.alert("Премиум подписка", "Получите доступ ко всем функциям приложения", [
                { text: "Позже", style: "cancel" },
                { text: "Обновить", style: "default" },
              ]);
            }}
            icon="⭐"
          />
        </SlideInRightView>

        <SlideInRightView
          delay={800}
          duration={500}>
          <SettingAction
            label={settingsStrings.dataExport}
            onPress={() => {
              Alert.alert("Экспорт данных", "Ваши данные будут экспортированы в файл");
            }}
            icon="📤"
          />
        </SlideInRightView>

        <SlideInRightView
          delay={850}
          duration={500}>
          <SettingAction
            label={settingsStrings.privacy}
            onPress={() => {
              Alert.alert("Конфиденциальность", "Настройки конфиденциальности");
            }}
            icon="🔒"
          />
        </SlideInRightView>

        <SlideInRightView
          delay={900}
          duration={500}>
          <SettingAction
            label={settingsStrings.logout}
            onPress={handleLogout}
            icon="🚪"
            showChevron={false}
          />
        </SlideInRightView>
      </SettingsSection>

      {/* О приложении */}
      <SettingsSection
        title={settingsStrings.about}
        icon="ℹ️">
        <SlideInRightView
          delay={950}
          duration={500}>
          <SettingAction
            label={settingsStrings.version}
            value="1.0.0"
            onPress={() => {}}
            icon="📱"
            showChevron={false}
          />
        </SlideInRightView>

        <SlideInRightView
          delay={1000}
          duration={500}>
          <SettingAction
            label={settingsStrings.rateApp}
            onPress={handleRateApp}
            icon="⭐"
          />
        </SlideInRightView>

        <SlideInRightView
          delay={1050}
          duration={500}>
          <SettingAction
            label={settingsStrings.shareApp}
            onPress={handleShareApp}
            icon="📤"
          />
        </SlideInRightView>

        <SlideInRightView
          delay={1100}
          duration={500}>
          <SettingAction
            label={settingsStrings.feedback}
            onPress={handleFeedback}
            icon="💌"
          />
        </SlideInRightView>

        <SlideInRightView
          delay={1150}
          duration={500}>
          <SettingAction
            label={settingsStrings.privacyPolicy}
            onPress={handlePrivacyPolicy}
            icon="📄"
          />
        </SlideInRightView>

        <SlideInRightView
          delay={1200}
          duration={500}>
          <SettingAction
            label={settingsStrings.termsOfService}
            onPress={handleTermsOfService}
            icon="📝"
          />
        </SlideInRightView>
      </SettingsSection>

      {/* Декоративный разделитель */}
      <AnimatedView
        type="fadeIn"
        delay={1300}
        duration={500}
        style={styles.footer}>
        <Text
          variant="caption"
          style={[styles.footerText, { color: colors.placeholder }]}>
          🇰🇷 С любовью к корейскому языку
        </Text>
      </AnimatedView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 32,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  footer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default SettingsScreen;
