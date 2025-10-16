import React from "react";
import type { ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

/**
 ** Container - базовая обертка для контейнеров
 */
export const Container = (props: { children: React.ReactNode; style?: ViewStyle }) => {
  // ? Props
  const { children, style } = props;

  // ? Render
  return <View style={[styles.container, style]}>{children}</View>;
};

// ? Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
