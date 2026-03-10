import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { goBack } from "shared/config/navigation";
import { Button, Card, Text, TextInput, Touchable } from "shared/ui/paper-kit";

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation("authScreen");

  const handleSendInstructions = async () => {
    if (!email) {
      Alert.alert(t("common.error"), t("validation.emailRequired"));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t("common.error"), t("validation.emailInvalid"));
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Integrate with your auth API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      Alert.alert(t("forgotPassword.successTitle"), t("forgotPassword.successMessage"), [
        { text: "OK", onPress: () => goBack() },
      ]);
    } catch (error) {
      Alert.alert(t("common.error"), t("errors.unknownError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text
            variant="headline"
            style={styles.title}>
            {t("forgotPassword.title")}
          </Text>
          <Text
            variant="body"
            style={styles.subtitle}>
            {t("forgotPassword.subtitle")}
          </Text>
        </View>

        {/* Instruction Card */}
        <Card style={styles.instructionCard}>
          <View style={styles.infoIcon}>
            <Text style={styles.infoIconText}>💡</Text>
          </View>
          <Text
            variant="body"
            style={styles.instructionText}>
            {t("forgotPassword.instruction")}
          </Text>
        </Card>

        {/* Form Card */}
        <Card style={styles.formCard}>
          <TextInput
            label={t("common.email")}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.textInput}
          />

          <Button
            onPress={handleSendInstructions}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
            icon="email-send"
            mode="contained">
            {isLoading ? t("forgotPassword.sending") : t("forgotPassword.sendInstructions")}
          </Button>

          <Touchable
            style={styles.backButton}
            onPress={() => goBack()}>
            <Text
              variant="caption"
              style={styles.backButtonText}>
              {t("forgotPassword.backToLogin")}
            </Text>
          </Touchable>
        </Card>

        {/* Decorative Element */}
        <View style={styles.decoration}>
          <Text style={styles.decorationText}>🇰🇷</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 20,
  },
  instructionCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoIconText: {
    fontSize: 18,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 18,
  },
  formCard: {
    marginBottom: 32,
    borderRadius: 20,
  },
  textInput: {
    marginBottom: 20,
  },
  submitButton: {
    marginBottom: 16,
    borderRadius: 12,
    height: 50,
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  backButtonText: {
    fontWeight: "500",
  },
  decoration: {
    alignItems: "center",
    marginTop: 40,
  },
  decorationText: {
    fontSize: 48,
    opacity: 0.1,
  },
});

export { ForgotPasswordScreen };
