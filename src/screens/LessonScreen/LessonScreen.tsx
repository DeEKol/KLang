// ? Library Imports
import React from "react";
import type { ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
// ? Component Imports
import { Lesson } from "widgets/Lesson";

/*
 * Экран урока
 */
export const LessonScreen = () => {
  const styles = createStyles();

  // ? Render
  return (
    <View style={styles.wrapper}>
      <Lesson />
    </View>
  );
};

// ? Styles
type TLessonStyle = {
  wrapper: ViewStyle;
};

const createStyles = () => {
  const styles: TLessonStyle = StyleSheet.create<TLessonStyle>({
    wrapper: {},
  });
  return styles;
};
