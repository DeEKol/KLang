import React from "react";
import { StyleSheet } from "react-native";
import { TextInput as PaperTextInput, useTheme } from "react-native-paper";

import type { UITextInputProps } from "./types";

/**
 * TextInput - wrapper for Paper TextInput
 */
export const TextInput = (props: UITextInputProps): React.JSX.Element => {
  // ? Props
  const {
    label,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = "default",
    autoCapitalize = "none",
    style,
    error = false,
    ...rest
  } = props;

  // ? Theme
  const theme = useTheme();

  // ? Render
  return (
    <PaperTextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      mode="outlined"
      style={[styles.textInput, style]}
      error={error}
      theme={theme}
      {...rest}
    />
  );
};

// ? Styles
const styles = StyleSheet.create({
  textInput: {
    marginBottom: 16,
    flex: 1,
  },
});
