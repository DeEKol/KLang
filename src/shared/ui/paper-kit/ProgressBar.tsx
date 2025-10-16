// shared/ui/paper-kit/ProgressBar.tsx
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

interface IProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  style?: Record<string, unknown>;
}

export const ProgressBar = ({ progress, color, style }: IProgressBarProps) => {
  const theme = useTheme();

  return (
    <View style={{ ...styles.container, ...style }}>
      <View
        style={[
          styles.progress,
          {
            width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
            backgroundColor: color || theme.colors.primary,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: 4,
  },
});
