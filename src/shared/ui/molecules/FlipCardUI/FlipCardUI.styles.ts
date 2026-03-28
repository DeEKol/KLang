import { StyleSheet } from "react-native";
import type { IThemeColors } from "shared/lib/theme";

export default function FlipCardUIStyles(colors: IThemeColors) {
  return StyleSheet.create({
    container: {
      alignSelf: "flex-start",
    },
    cardContainer: {
      width: 200,
      height: 300,
    },
    card: {
      position: "absolute",
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      backfaceVisibility: "hidden",
      borderRadius: 10,
    },
    frontCard: {},
    backCard: {
      transform: [{ rotateY: "180deg" }],
    },
    text: {
      color: colors.primary,
      fontSize: 20,
      fontWeight: "bold",
    },
  });
}
