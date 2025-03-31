import { StyleSheet } from "react-native";
import type { TThemeColors } from "shared/lib/theme";
import { EPalette } from "shared/lib/theme";
import type { EButtonUITheme } from "shared/ui/atoms";

export default function FlipCardUIStyles(themeUI: EButtonUITheme, themeGlobal: TThemeColors) {
  return StyleSheet.create({
    container: {
      // flex: 1,
      // justifyContent: "center",
      // alignItems: "center",
      // backgroundColor: "#f0f0f0",
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
    frontCard: {
      // backgroundColor: "#4CAF50",
    },
    backCard: {
      // backgroundColor: "#FF5722",
      transform: [{ rotateY: "180deg" }],
    },
    text: {
      color: EPalette.WHITE,
      fontSize: 20,
      fontWeight: "bold",
    },
  });
}
