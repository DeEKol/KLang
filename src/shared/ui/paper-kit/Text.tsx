import React from "react";
import type { TextStyle } from "react-native";
import { StyleSheet } from "react-native";
import { Text as PaperText, useTheme } from "react-native-paper";

import type { UITextProps } from "./types";

/**
 ** Text - обертка над Paper Text с предопределенными стилями
 */
export const Text = (props: UITextProps) => {
  // ? Props
  const { variant = "body", children, style, color } = props;

  // ? Utils
  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case "headline":
        return styles.headline;
      case "title":
        return styles.title;
      case "caption":
        return styles.caption;
      default:
        return styles.body;
    }
  };

  // ? Render
  return (
    <PaperText style={[getVariantStyle(), color ? { color } : {}, style]}>{children}</PaperText>
  );
};

// ? Styles
const styles = StyleSheet.create({
  headline: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
});
