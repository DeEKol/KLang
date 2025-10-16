import type { TextStyle, ViewStyle } from "react-native";
import type { MD3Elevation } from "react-native-paper";

export interface UIButtonProps {
  mode?: "text" | "outlined" | "contained";
  onPress: () => void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: string;
}

export interface UITextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  style?: ViewStyle;
  error?: boolean;
  [key: string]: unknown;
}

export interface UITextProps {
  variant?: "headline" | "title" | "body" | "caption";
  children: React.ReactNode;
  style?: TextStyle;
  color?: string;
}

export interface UICardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: number & MD3Elevation;
}
