import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { goBack } from "shared/config/navigation";
import { Button, Card, Text, TextInput, Touchable } from "shared/ui/paper-kit";

import authStrings from "./auth.i18n";

const SignupScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName) {
      Alert.alert(authStrings.common.error, authStrings.validation.firstNameRequired);
      return false;
    }
    if (!formData.lastName) {
      Alert.alert(authStrings.common.error, authStrings.validation.lastNameRequired);
      return false;
    }
    if (!formData.email) {
      Alert.alert(authStrings.common.error, authStrings.validation.emailRequired);
      return false;
    }
    if (!formData.phone) {
      Alert.alert(authStrings.common.error, authStrings.validation.phoneRequired);
      return false;
    }
    if (!formData.password) {
      Alert.alert(authStrings.common.error, authStrings.validation.passwordRequired);
      return false;
    }
    if (formData.password.length < 8) {
      Alert.alert(authStrings.common.error, authStrings.validation.passwordMinLength);
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert(authStrings.common.error, authStrings.validation.passwordsNotMatch);
      return false;
    }
    if (!acceptedTerms) {
      Alert.alert(authStrings.common.error, authStrings.validation.termsRequired);
      return false;
    }
    return true;
  };

  const handleRegistration = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Integrate with your registration API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      // Navigate to email confirmation screen
      // ! navigation.navigate("EmailConfirmation", { email: formData.email });
    } catch (error) {
      const errorMessage = String(error) || authStrings.errors.unknownError;
      Alert.alert(authStrings.common.error, errorMessage);
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
            {authStrings.registration.title}
          </Text>
          <Text
            variant="body"
            style={styles.subtitle}>
            {authStrings.registration.subtitle}
          </Text>
        </View>

        {/* Registration Form */}
        <Card style={styles.formCard}>
          <View style={styles.nameRow}>
            <TextInput
              label={authStrings.registration.firstName}
              value={formData.firstName}
              onChangeText={(value) => handleInputChange("firstName", value)}
              // style={[styles.textInput, styles.halfInput]}
              autoCapitalize="words"
            />
            <TextInput
              label={authStrings.registration.lastName}
              value={formData.lastName}
              onChangeText={(value) => handleInputChange("lastName", value)}
              // style={[styles.textInput, styles.halfInput]}
              autoCapitalize="words"
            />
          </View>

          <TextInput
            label={authStrings.common.email}
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.textInput}
          />

          <TextInput
            label={authStrings.registration.phoneNumber}
            value={formData.phone}
            onChangeText={(value) => handleInputChange("phone", value)}
            keyboardType="numeric"
            autoComplete="tel"
            style={styles.textInput}
            placeholder="+7 (XXX) XXX-XX-XX"
          />

          <TextInput
            label={authStrings.common.password}
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
            secureTextEntry
            style={styles.textInput}
          />

          <TextInput
            label={authStrings.common.confirmPassword}
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange("confirmPassword", value)}
            secureTextEntry
            style={styles.textInput}
          />

          {/* Terms Agreement */}
          <View style={styles.termsContainer}>
            <Touchable
              style={styles.checkbox}
              onPress={() => setAcceptedTerms(!acceptedTerms)}>
              <View style={[styles.checkboxBox, acceptedTerms && styles.checkboxBoxChecked]}>
                {acceptedTerms && <Text style={styles.checkmark}>{"✓"}</Text>}
              </View>
            </Touchable>
            <Text
              variant="caption"
              style={styles.termsText}>
              {authStrings.registration.agreeToTerms}{" "}
              <Text style={styles.termsLink}>{authStrings.registration.termsAndConditions}</Text>{" "}
              {authStrings.registration.and}{" "}
              <Text style={styles.termsLink}>{authStrings.registration.privacyPolicy}</Text>
            </Text>
          </View>

          <Button
            onPress={handleRegistration}
            loading={isLoading}
            disabled={isLoading}
            style={styles.registerButton}
            icon="account-plus"
            mode="contained">
            {isLoading
              ? authStrings.registration.creatingAccount
              : authStrings.registration.createAccount}
          </Button>

          <View style={styles.loginContainer}>
            <Text
              variant="caption"
              style={styles.loginText}>
              {authStrings.registration.alreadyHaveAccount}{" "}
            </Text>
            <Touchable onPress={() => goBack()}>
              <Text style={styles.loginLink}>{authStrings.registration.signIn}</Text>
            </Touchable>
          </View>
        </Card>

        {/* Decorative Element */}
        <View style={styles.decoration}>
          <Text style={styles.decorationText}>📚</Text>
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
    paddingTop: 40,
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
  formCard: {
    marginBottom: 32,
    borderRadius: 20,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    marginBottom: 16,
  },
  // halfInput: {
  //   flex: 0.48,
  // },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
    marginTop: 8,
  },
  checkbox: {
    padding: 4,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxBoxChecked: {},
  checkmark: {
    fontSize: 12,
    fontWeight: "bold",
  },
  termsText: {
    flex: 1,
    lineHeight: 18,
  },
  termsLink: {
    fontWeight: "500",
  },
  registerButton: {
    marginBottom: 20,
    borderRadius: 12,
    height: 50,
  },
  loginContainer: {
    alignItems: "center",
  },
  loginText: {},
  loginLink: {
    fontWeight: "500",
  },
  decoration: {
    alignItems: "center",
    marginTop: 20,
  },
  decorationText: {
    fontSize: 48,
    opacity: 0.1,
  },
});

export { SignupScreen };
