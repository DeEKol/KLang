import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useAuth } from "features/auth";
import { ENavigation, navigate } from "shared/config/navigation";
import { Button, Card, Text, TextInput, Touchable } from "shared/ui/paper-kit";

/**
 * Стильный экран входа с корейской тематикой
 * Использует кастомный UI Kit на основе React Native Paper
 */
export const LoginScreen: React.FC = () => {
  const { t } = useTranslation("authScreen");
  const { loginWithEmail, loginWithGoogle, loginAnonymously } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onLoginPress = async () => {
    if (!email || !password) {
      Alert.alert(t("login.errorTitle"), t("login.fillFields"));
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (e) {
      console.warn("Login failed:", e);
      Alert.alert(t("login.loginError"), String(e) ?? t("login.unknownError"));
    } finally {
      setIsLoading(false);
    }
  };

  const onAnonymousPress = async () => {
    try {
      await loginAnonymously();
    } catch (e) {
      console.warn("Login failed:", e);
      Alert.alert(t("login.loginError"), String(e) ?? t("login.unknownError"));
    }
  };

  const onGooglePress = async () => {
    try {
      const user = await loginWithGoogle();
      console.log("Google login success:", user);
    } catch (e) {
      console.warn("Google login failed:", e);
      Alert.alert(t("login.googleError"), String(e));
    }
  };

  const onBiometricPress = async () => {
    Alert.alert(t("login.biometricTitle"), t("login.biometricMessage"));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.koreanBadge}>
            <Text
              variant="caption"
              style={styles.koreanBadgeText}>
              {t("login.koreanTitle")}
            </Text>
          </View>
          <Text
            variant="headline"
            style={styles.heroTitle}>
            {t("login.welcomeTitle")}
          </Text>
          <Text
            variant="body"
            style={styles.heroSubtitle}>
            {t("login.welcomeSubtitle")}
          </Text>
        </View>

        {/* Login Form Card */}
        <Card
          style={styles.formCard}
          elevation={2}>
          <Text
            variant="title"
            style={styles.formTitle}>
            {t("login.loginTitle")}
          </Text>

          <TextInput
            label={t("login.emailLabel")}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.textInput}
          />

          <TextInput
            label={t("login.passwordLabel")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.textInput}
          />

          <Button
            onPress={onLoginPress}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
            icon="login"
            mode="contained">
            {isLoading ? t("login.loggingIn") : t("login.loginButton")}
          </Button>

          <Touchable
            style={styles.forgotPasswordTouchable}
            onPress={() => navigate(ENavigation.FORGOT_PASSWORD)}>
            <Text
              variant="caption"
              style={styles.forgotPasswordText}>
              {t("login.forgotPassword")}
            </Text>
          </Touchable>
        </Card>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text
            variant="caption"
            style={styles.dividerText}>
            {t("login.orDivider")}
          </Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Alternative Login Methods */}
        <View style={styles.alternativeSection}>
          <Button
            mode="outlined"
            onPress={onGooglePress}
            style={styles.alternativeButton}
            icon="google">
            {t("login.googleLogin")}
          </Button>

          <Button
            mode="outlined"
            onPress={onBiometricPress}
            style={styles.alternativeButton}
            icon="fingerprint">
            {t("login.biometricLogin")}
          </Button>

          <Button
            mode="text"
            onPress={onAnonymousPress}
            style={styles.anonymousButton}
            icon="incognito">
            {t("login.anonymousLogin")}
          </Button>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text
            variant="caption"
            style={styles.footerText}>
            {t("login.noAccount")}{" "}
          </Text>
          <Touchable onPress={() => navigate(ENavigation.SIGNUP)}>
            <Text
              variant="caption"
              style={styles.footerLink}>
              {t("login.register")}
            </Text>
          </Touchable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center" as const,
    marginBottom: 48,
    paddingHorizontal: 20,
  },
  koreanBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  koreanBadgeText: {
    fontWeight: "600" as const,
    fontSize: 14,
  },
  heroTitle: {
    textAlign: "center" as const,
    marginBottom: 12,
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 38,
  },
  heroSubtitle: {
    textAlign: "center" as const,
    lineHeight: 22,
    fontSize: 16,
  },
  formCard: {
    marginBottom: 32,
    borderRadius: 20,
    overflow: "hidden" as const,
    borderWidth: 0,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  formTitle: {
    marginBottom: 24,
    fontSize: 20,
    fontWeight: "600" as const,
    textAlign: "center" as const,
  },
  textInput: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 12,
    height: 50,
  },
  forgotPasswordTouchable: {
    alignItems: "center" as const,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    fontWeight: "500" as const,
  },
  dividerContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "500" as const,
  },
  alternativeSection: {
    marginBottom: 24,
  },
  alternativeButton: {
    marginBottom: 12,
    borderRadius: 12,
    height: 50,
  },
  anonymousButton: {
    marginTop: 8,
  },
  buttonContent: {
    height: 60,
    flex: 1,
  },
  footer: {
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    marginTop: "auto" as const,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontWeight: "bold" as const,
  },
};
