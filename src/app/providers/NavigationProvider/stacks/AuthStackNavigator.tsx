// ? Library Imports
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// ? Layer Imports
import { EmailConfirmationScreen } from "screens/Auth/EmailConfirmationScreen";
import { ForgotPasswordScreen } from "screens/Auth/ForgotPasswordScreen";
import { LoginScreen } from "screens/Auth/LoginScreen";
import { SignupScreen } from "screens/Auth/SignupScreen";
import { SMSConfirmationScreen } from "screens/Auth/SMSConfirmationScreen";
import { ENavigation, type TAuthStackParamList } from "shared/config/navigation";

// ? Components
const Stack = createNativeStackNavigator<TAuthStackParamList>();

export const AuthStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ENavigation.LOGIN}
        component={LoginScreen}
      />
      <Stack.Screen
        name={ENavigation.SIGNUP}
        component={SignupScreen}
      />
      <Stack.Screen
        name={ENavigation.FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name={ENavigation.EMAIL_CONFIRMATION}
        component={EmailConfirmationScreen}
      />
      <Stack.Screen
        name={ENavigation.SMS_CONFIRMATION}
        component={SMSConfirmationScreen}
      />
    </Stack.Navigator>
  );
};
