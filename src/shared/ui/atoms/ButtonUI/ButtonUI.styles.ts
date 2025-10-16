import type { TextStyle, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import type { TThemeMode } from "entities/theme";
import { exhaustiveCheck } from "shared/helpers";
import { Colors, EPalette } from "shared/lib/theme";

import { EButtonUITheme } from "./types";

type TButtonUIStyle = {
  viewStyle: ViewStyle;
  uiStyle: ViewStyle;
  globalBtnStyle: ViewStyle;
  globalTitleStyle: TextStyle;
};

const uiTheme = (themeUI: EButtonUITheme): ViewStyle | undefined => {
  return (function (themeParam: EButtonUITheme): ViewStyle | undefined {
    switch (themeParam) {
      case EButtonUITheme.BACKGROUND:
        return {
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: EPalette.ACCENT,
          borderRadius: 8,
        };
      case EButtonUITheme.CLEAR:
        return {
          backgroundColor: "transparent",
          borderRadius: 8,
        };
      case EButtonUITheme.DEFAULT:
        return {
          backgroundColor: EPalette.PRIMARY,
          borderRadius: 8,
        };
      default:
        exhaustiveCheck(themeParam);
    }
  })(themeUI);
};

export default (themeUI: EButtonUITheme, themeGlobal: TThemeMode) => {
  return StyleSheet.create<TButtonUIStyle>({
    viewStyle: {
      margin: "auto",
      marginLeft: "auto",
      marginRight: "auto",

      position: "relative",

      borderRadius: 8,
    },
    uiStyle: {
      ...uiTheme(themeUI),
    },
    globalBtnStyle: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "center",

      paddingTop: 12,
      paddingBottom: 12,
      paddingRight: 20,
      paddingLeft: 20,
    },
    globalTitleStyle: {
      color: Colors[themeGlobal ?? "light"]?.text,
      fontSize: 24,
      lineHeight: 24,
    },
  });
};
