import { Platform, StyleSheet } from "react-native";
import type { IThemeColors } from "shared/lib/theme";

export default function createStyles(colors: IThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      padding: 12,
      backgroundColor: colors.background,
      ...Platform.select({
        ios: {
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: { elevation: 8 },
      }),
    },
    columnsContainer: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      flex: 1,
      marginVertical: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      textAlign: "center",
      color: colors.text,
      textShadowColor: "rgba(0,0,0,0.1)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      marginTop: 16,
    },
    resetButton: {
      position: "absolute",
      padding: 12,
      borderRadius: 16,
      backgroundColor: colors.surface,
      bottom: 16,
      right: 16,
      zIndex: 1004,
    },
  });
}
