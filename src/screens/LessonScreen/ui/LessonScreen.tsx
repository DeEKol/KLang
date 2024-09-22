// ? Library Imports
import React from "react";
import type { TextStyle, ViewStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
// ? Component Imports
import type { TThemeColors } from "shared/lib/theme";
import { Colors, getThemeColor } from "shared/lib/theme";
import { Lesson } from "widgets/Lesson";

/*
 * Экран урока
 */
export const LessonScreen = () => {
  // ? Hooks
  const theme: TThemeColors = useSelector(getThemeColor);

  // ? Styles
  const styles = createStyles(theme);

  // ? Render
  return (
    <View style={styles.wrapper}>
      <Text style={styles.textStyle}>123</Text>
      <Lesson />
    </View>
  );
};

// ? Styles
type TLessonStyle = {
  textStyle: TextStyle;
  wrapper: ViewStyle;
};

const createStyles = (theme: TThemeColors) => {
  const styles: TLessonStyle = StyleSheet.create<TLessonStyle>({
    textStyle: {
      color: Colors[theme ?? "light"]?.text,
    },
    wrapper: {},
  });
  return styles;
};
