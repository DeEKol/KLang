import React from "react";
import { StyleSheet } from "react-native";
import { ActivityIndicator, Button as PaperButton, useTheme } from "react-native-paper";

import type { UIButtonProps } from "./types";

/**
 ** Button - обертка над Paper Button
 */
export const Button = (props: UIButtonProps) => {
  const theme = useTheme();

  // ? Props
  const {
    mode = "contained",
    onPress,
    children,
    loading = false,
    disabled = false,
    style,
    icon,
  } = props;

  // ? Render
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
      icon={icon}
      contentStyle={styles.buttonContent}
      theme={{
        ...theme,
        colors: {
          ...theme.colors,
          primary: theme.colors.primary,
        },
      }}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color="white"
        />
      ) : (
        children
      )}
    </PaperButton>
  );
};

// ? Styles
const styles = StyleSheet.create({
  buttonContent: {
    flexBasis: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
