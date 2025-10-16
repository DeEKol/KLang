import React from "react";
import type { ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import { Surface as PaperSurface, useTheme } from "react-native-paper";

/**
 ** Surface - обертка над Paper Surface
 */
export const Surface = (props: { children: React.ReactNode; style?: ViewStyle }) => {
  // ? Props
  const { children, style } = props;

  // ? Render
  return <PaperSurface style={[styles.surface, style]}>{children}</PaperSurface>;
};

// ? Styles
const styles = StyleSheet.create({
  surface: {
    borderRadius: 12,
    padding: 16,
  },
});
