// ? Library Imports
import React from "react";
import type { ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";
// ? Layer Imports
import { Markdown } from "features/Markdown";
import { StepsSwiper } from "features/StepsSwiper";

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
      <StepsSwiper
        data={[
          <Markdown
            key={0}
            text={markdownText}
          />,
          <Markdown
            key={1}
            text={markdownText}
          />,
          <Markdown
            key={2}
            text={markdownText}
          />,
          <Markdown
            key={2}
            text={markdownText}
          />,
        ]}
      />
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
