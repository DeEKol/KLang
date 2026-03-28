// ? Library Imports
import React from "react";
import { useTranslation } from "react-i18next";
import type { TextStyle } from "react-native";
import { Pressable, StyleSheet, Text } from "react-native";
import type { FlexStyle, ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";
// ? Layer Imports
import type { IThemeColors } from "shared/lib/theme";
import { useThemeTokens } from "shared/lib/theme";

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
  const { colors } = useThemeTokens();
  const { t } = useTranslation();

  // ? Styles
  const styles = createStyles(colors);

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
const createStyles = (colors: IThemeColors) => {
  const styles = StyleSheet.create<TRoadMapButtonUiStyle>({
    uiStyle: {
      backgroundColor: colors.primary,
      width: 100,
      height: 100,
      borderRadius: 50,

      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      color: colors.text,
      padding: 5,
    },
    buttonPressed: {
      backgroundColor: colors.accent,
    },
  });
  return styles;
};
