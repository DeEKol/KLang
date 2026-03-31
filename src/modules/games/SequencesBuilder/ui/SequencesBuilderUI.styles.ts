import { StyleSheet } from "react-native";
import type { IThemeColors } from "shared/lib/theme";

export default function createStyles(colors: IThemeColors) {
  return StyleSheet.create({
    screen: {
      padding: 18,
      alignItems: "center",
      paddingBottom: 80,
      minHeight: "100%",
    },
    card: {
      width: "100%",
      maxWidth: 960,
      padding: 18,
      borderRadius: 14,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
      textAlign: "center",
      color: colors.text,
    },
    sentenceWrap: {
      padding: 12,
      borderRadius: 10,
      marginBottom: 12,
      backgroundColor: colors.surfaceVariant,
    },
    sentenceRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
    },
    sentenceText: {
      fontSize: 18,
      lineHeight: 28,
      marginHorizontal: 2,
      color: colors.text,
    },
    metaRow: {
      marginTop: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    score: {
      color: colors.placeholder,
    },
    resetButton: {
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: colors.surfaceVariant,
    },
    resetButtonText: {
      color: colors.text,
    },
    resetPressed: {
      opacity: 0.8,
    },
    optionsCard: {
      marginTop: 6,
      padding: 10,
      borderRadius: 10,
      backgroundColor: colors.surfaceVariant,
    },
    optionsTitle: {
      marginBottom: 8,
      fontSize: 14,
      color: colors.placeholder,
    },
    hintSmall: {
      marginTop: 8,
      fontSize: 13,
      color: colors.placeholder,
    },
  });
}
