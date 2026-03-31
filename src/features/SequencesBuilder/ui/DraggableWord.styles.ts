import { StyleSheet } from "react-native";
import type { IThemeColors } from "shared/lib/theme";

export default function createStyles(colors: IThemeColors) {
  return StyleSheet.create({
    chip: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      margin: 6,
      elevation: 2,
      backgroundColor: colors.surface,
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 4,
    },
    chipDisabled: {
      backgroundColor: colors.disabled,
    },
    chipText: {
      fontWeight: "600",
      color: colors.text,
    },
    chipTextDisabled: {
      opacity: 0.5,
    },
  });
}
