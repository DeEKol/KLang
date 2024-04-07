import type { TextStyle, ViewStyle } from "react-native";
import { StyleSheet } from "react-native";
import { exhaustiveCheck } from "shared/helpers";
import { Colors } from "shared/lib/theme";
import { EPalette } from "shared/lib/theme/colors/Palette";
import type { TThemeColors } from "shared/lib/theme/types/themeSchema";

import { EButtonUITheme } from "./types";

type TButtonUIStyle = {
  uiStyle: TextStyle;
  globalBtnStyle: ViewStyle;
  globalTitleStyle: TextStyle;
};

const uiTheme = (themeUI: EButtonUITheme) => {
  return (function (themeParam: EButtonUITheme) {
    switch (themeParam) {
      case EButtonUITheme.BACKGROUND:
        return { color: EPalette.YELLOW };
      case EButtonUITheme.CLEAR:
        return { color: EPalette.RED };
      case EButtonUITheme.DEFAULT:
        return { color: EPalette.BLUE };
      default:
        exhaustiveCheck(themeParam);
    }
  })(themeUI);
};

export default (themeUI: EButtonUITheme, themeGlobal: TThemeColors) => {
  return StyleSheet.create<TButtonUIStyle>({
    uiStyle: {
      ...uiTheme(themeUI),
    },
    globalBtnStyle: {
      // display: "flex",
      flexDirection: "row",
      alignItems: "center",
      // justifyContent: "center",
      // backgroundColor: "grey",
      alignSelf: "center",
      // flexBasis: "50%",
      // minWidth: "50%",

      padding: 5,

      borderWidth: 1,
      borderStyle: "solid",
      borderColor: EPalette.RED,
      borderRadius: 8,
    },
    globalTitleStyle: {
      color: Colors[themeGlobal ?? "light"]?.text,
      // color: "blue",
      fontSize: 30,
      lineHeight: 30,
      paddingLeft: 5,
    },
  });
};
