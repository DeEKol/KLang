import { StyleSheet } from "react-native";
import type { IThemeColors } from "shared/lib/theme";

export default function createStyles(colors: IThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: colors.background,
    },
    content: {
      flex: 3,
      alignItems: "center",
      justifyContent: "center",
    },
    footer: {
      flex: 1,
      // alignItems: "center",
      justifyContent: "flex-end",
      paddingBottom: 16,
    },
    continueButton: {
      height: 50,
    },
    gameName: {
      fontSize: 16,
      color: colors.onSurface,
      marginBottom: 8,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 32,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      marginBottom: 40,
    },
    stat: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 36,
      fontWeight: "700",
      color: colors.text,
    },
    statLabel: {
      fontSize: 14,
      color: colors.onSurface,
      marginTop: 4,
    },
  });
}
