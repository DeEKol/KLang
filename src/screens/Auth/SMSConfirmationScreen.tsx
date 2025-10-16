import React, { useEffect, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import type { Route } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { ENavigation, resetTo } from "shared/config/navigation";
import { Button, Card, Text, TextInput, Touchable } from "shared/ui/paper-kit";
import { v4 as uuid } from "uuid";

import authStrings from "./auth.i18n";

const SMSConfirmationScreen: React.FC = () => {
  const route: Route<string, { phone: string }> = useRoute();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  // const inputRefs = useRef<any[]>([]);

  const phone = route.params?.phone || "+7 (XXX) XXX-XX-XX";

  useEffect(() => {
    startResendCooldown();
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const startResendCooldown = () => {
    setResendCooldown(60); // 60 seconds cooldown
  };

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split("");
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);

      // Focus last input
      const lastFilledIndex = pastedCode.findIndex((char) => !char) + index;
      const focusIndex = lastFilledIndex < 6 ? lastFilledIndex : 5;
      // inputRefs.current[focusIndex]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      // inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: { nativeEvent: React.KeyboardEvent }, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      // inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerification = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      Alert.alert(authStrings.common.error, authStrings.validation.codeInvalid);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Integrate with your SMS verification API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      Alert.alert(
        authStrings.smsConfirmation.successTitle,
        authStrings.smsConfirmation.successMessage,
        [
          {
            text: "OK",
            onPress: () => resetTo(ENavigation.MAIN),
          },
        ],
      );
    } catch (error) {
      const errorMessage = String(error) || authStrings.errors.unknownError;
      Alert.alert(authStrings.common.error, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    try {
      // TODO: Integrate with your resend SMS API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      startResendCooldown();
      Alert.alert("Успешно", "SMS отправлено повторно");
    } catch (error) {
      Alert.alert(authStrings.common.error, authStrings.errors.unknownError);
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
          <View style={styles.phoneIcon}>
            <Text style={styles.phoneIconText}>📱</Text>
          </View>
          <Text
            variant="headline"
            style={styles.title}>
            {authStrings.smsConfirmation.title}
          </Text>
          <Text
            variant="body"
            style={styles.subtitle}>
            {authStrings.smsConfirmation.subtitle}
          </Text>
          <Text
            variant="caption"
            style={styles.phone}>
            {phone}
          </Text>
        </View>

        {/* Code Input Card */}
        <Card style={styles.card}>
          <Text
            variant="body"
            style={styles.instruction}>
            {authStrings.smsConfirmation.instruction}
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={uuid()}
                // ref={(ref: React.JSX.Element) => (inputRefs.current[index] = ref)}
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
                onKeyPress={(e: { nativeEvent: React.KeyboardEvent }) => handleKeyPress(e, index)}
                label=""
                keyboardType="numeric"
                maxLength={index === 0 ? 6 : 1} // Allow paste on first input
                style={styles.codeInput}
                textStyle={styles.codeInputText}
                outlineStyle={styles.codeInputOutline}
              />
            ))}
          </View>

          <Button
            onPress={handleVerification}
            loading={isLoading}
            disabled={isLoading || code.join("").length !== 6}
            style={styles.verifyButton}
            icon="cellphone-check"
            mode="contained">
            {isLoading ? authStrings.smsConfirmation.verifying : authStrings.smsConfirmation.verify}
          </Button>

          <View style={styles.resendContainer}>
            <Text
              variant="caption"
              style={styles.resendText}>
              {authStrings.smsConfirmation.resendCode}
            </Text>
            <Touchable
              onPress={handleResendCode}
              disabled={resendCooldown > 0}>
              <Text
                variant="caption"
                style={styles.resendButton}>
                {resendCooldown > 0
                  ? `${authStrings.smsConfirmation.resendIn} ${resendCooldown}${authStrings.smsConfirmation.seconds}`
                  : authStrings.common.resend}
              </Text>
            </Touchable>
          </View>
        </Card>

        {/* Decorative Element */}
        <View style={styles.decoration}>
          <Text style={styles.decorationText}>🔐</Text>
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
    marginBottom: 40,
  },
  phoneIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  phoneIconText: {
    fontSize: 32,
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  phone: {
    fontWeight: "500",
  },
  card: {
    alignItems: "center",
    marginBottom: 32,
    borderRadius: 20,
  },
  instruction: {
    textAlign: "center",
    marginBottom: 32,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    width: "100%",
  },
  codeInput: {
    width: 48,
    height: 60,
    textAlign: "center",
    fontSize: 20,
  },
  codeInputText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
  },
  codeInputOutline: {
    borderRadius: 12,
  },
  verifyButton: {
    width: "100%",
    marginBottom: 24,
    borderRadius: 12,
    height: 50,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  resendText: {
    marginRight: 8,
  },
  resendButton: {
    fontWeight: "500",
  },
  // resendButtonDisabled: {},
  decoration: {
    alignItems: "center",
    marginTop: 40,
  },
  decorationText: {
    fontSize: 48,
    opacity: 0.1,
  },
});

export { SMSConfirmationScreen };
