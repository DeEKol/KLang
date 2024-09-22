// ? Library Imports
import React from "react";
import type { ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
// ? Layer Imports
import { Markdown } from "features/Markdown";

// ? Mocks
const markdownText = `
# Заголовок
**Жирный текст**
*Курсив*
- Список
- Элемент 2
== Подсветка ==
`;

export const Lesson = () => {
  // ? Styles
  const styles = createStyles();

  // ? Render
  return (
    <View style={styles.wrapper}>
      <Markdown text={markdownText} />
    </View>
  );
};

type TLessonStyle = {
  wrapper: ViewStyle;
};

// ? Styles
const createStyles = () => {
  const styles = StyleSheet.create<TLessonStyle>({
    wrapper: {},
  });
  return styles;
};
