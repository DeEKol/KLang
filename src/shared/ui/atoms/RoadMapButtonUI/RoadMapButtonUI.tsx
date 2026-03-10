// ? Library Imports
import React from "react";
import { useTranslation } from "react-i18next";
import type { TextStyle } from "react-native";
import { Pressable, StyleSheet, Text } from "react-native";
import type { FlexStyle, ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
// ? Layer Imports
import { Colors, EPalette, useThemeTokens } from "shared/lib/theme";

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
  const { mode: theme } = useThemeTokens();
  const { t } = useTranslation();

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
const createStyles = (theme: TThemeMode) => {
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
      backgroundColor: EPalette.PRIMARY,
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
      backgroundColor: EPalette.ACCENT,
    },
  });
  return styles;
};
