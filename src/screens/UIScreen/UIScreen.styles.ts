import type { ViewStyle } from "react-native";
import { StyleSheet } from "react-native";

type TStyles = {
  viewStyle: ViewStyle;
  btnChildrenStyle: ViewStyle;
  outerViewStyle: ViewStyle;
  componentContainer: ViewStyle;
};

export default function UIScreenStyles() {
  return StyleSheet.create<TStyles>({
    viewStyle: {
      // backgroundColor: "green",
      // marginBottom: 5,
    },
    btnChildrenStyle: {
      marginRight: 6,
    },
    outerViewStyle: {
      marginBottom: 10,
    },
    componentContainer: {
      display: "flex",
      flexDirection: "column",
    },
  });
}
