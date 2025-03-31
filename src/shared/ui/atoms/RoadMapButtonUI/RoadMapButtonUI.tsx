// ? Library Imports
import React from "react";
import { useTranslation } from "react-i18next";
import type { TextStyle } from "react-native";
import { Pressable, StyleSheet, Text } from "react-native";
import type { FlexStyle, ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
import { useDispatch, useSelector } from "react-redux";
// ? Layer Imports
import { Colors, EPalette, getThemeColor, type TThemeColors } from "shared/lib/theme";

// ? Types
type TRoadMapButtonUiProps = {
  text?: string;
  onPress?: () => void;
};

export const RoadMapButtonUi = (props: TRoadMapButtonUiProps) => {
  // ? Props From
  const {
    text,
    onPress = () => {
      return;
    },
  } = props;

  // ? Hooks
  const theme: TThemeColors = useSelector(getThemeColor);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // ? Styles
  const styles = createStyles(theme);

  // ? Render
  return (
    // <View style={styles.container}>
    <Pressable
      style={({ pressed }) => [styles.uiStyle, pressed && styles.buttonPressed]}
      onPress={onPress}>
      {text && <Text>{text}</Text>}
    </Pressable>
    // </View>
  );
};

type TRoadMapButtonUiStyle = {
  // container: ViewStyle;
  uiStyle: TextStyle & FlexStyle;
  buttonPressed: ViewStyle;
};

// ? Styles
const createStyles = (theme: TThemeColors) => {
  const styles = StyleSheet.create<TRoadMapButtonUiStyle>({
    // container: {
    //   backgroundColor: "red",
    //   width: 100,
    //   height: 100,
    //   borderRadius: 50,
    //
    //   display: "flex",
    //   justifyContent: "center",
    //   alignItems: "center",
    // },
    uiStyle: {
      backgroundColor: EPalette.RED,
      width: 100,
      height: 100,
      borderRadius: 50,

      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      color: Colors[theme ?? "light"]?.text,
      padding: 5,
    },
    buttonPressed: {
      backgroundColor: EPalette.GREEN,
    },
  });
  return styles;
};
