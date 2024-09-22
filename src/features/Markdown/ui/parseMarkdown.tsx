// ? Library Imports
import React, { type ReactNode } from "react";
import { StyleSheet, Text, type TextStyle } from "react-native";
import { EPalette } from "shared/lib/theme";

// ? Slice Imports
import { generateUniqueKey } from "../utils/generators";

// ? Styles
export type TMarkdownStyle = {
  h1Style: TextStyle;
  h2Style: TextStyle;
  h3Style: TextStyle;
  h4Style: TextStyle;
  h5Style: TextStyle;
  h6Style: TextStyle;
  boldTextStyle: TextStyle;
  italicTextStyle: TextStyle;
  listsStyle: TextStyle;
  highlightStyle: TextStyle;
};

/*
 * Функция, обрабатывает md текст и возращает массив компонентов
 * @text Текст для обработки
 * @styles Стили
 */
export const parseMarkdown = (text: string, styles: TMarkdownStyle): ReactNode[] => {
  const elements: ReactNode[] = [];

  // * Разбиваем текст на строки
  const lines = text.split("\n");

  lines.forEach((line, index) => {
    // * Заголовки
    if (/^######\s*(.*)/.test(line)) {
      elements.push(
        <Text
          key={generateUniqueKey(line, index)}
          style={styles.h6Style}>
          {line.replace(/^######\s*/, "")}
        </Text>,
      );
    } else if (/^#####\s*(.*)/.test(line)) {
      elements.push(
        <Text
          key={generateUniqueKey(line, index)}
          style={styles.h5Style}>
          {line.replace(/^#####\s*/, "")}
        </Text>,
      );
    } else if (/^####\s*(.*)/.test(line)) {
      elements.push(
        <Text
          key={generateUniqueKey(line, index)}
          style={styles.h4Style}>
          {line.replace(/^####\s*/, "")}
        </Text>,
      );
    } else if (/^###\s*(.*)/.test(line)) {
      elements.push(
        <Text
          key={generateUniqueKey(line, index)}
          style={styles.h3Style}>
          {line.replace(/^###\s*/, "")}
        </Text>,
      );
    } else if (/^##\s*(.*)/.test(line)) {
      elements.push(
        <Text
          key={generateUniqueKey(line, index)}
          style={styles.h2Style}>
          {line.replace(/^##\s*/, "")}
        </Text>,
      );
    } else if (/^#\s*(.*)/.test(line)) {
      elements.push(
        <Text
          key={generateUniqueKey(line, index)}
          style={styles.h1Style}>
          {line.replace(/^#\s*/, "")}
        </Text>,
      );
    }
    // Жирный текст
    else if (/\*\*(.*?)\*\*/.test(line)) {
      const boldText = line.replace(/\*\*(.*?)\*\*/, "$1");
      elements.push(
        <Text
          key={generateUniqueKey(line, index)}
          style={styles.boldTextStyle}>
          {boldText}
        </Text>,
      );
    }
    // Курсив
    else if (/\*(.*?)\*/.test(line)) {
      const italicText = line.replace(/\*(.*?)\*/, "$1");
      elements.push(
        <Text
          key={generateUniqueKey(line, index)}
          style={styles.italicTextStyle}>
          {italicText}
        </Text>,
      );
    }
    // * Выделение цветом через == ==
    else if (/==(.+?)==/.test(line)) {
      // * Регулярное выражение для поиска и разделения текста с выделением цветом
      const parts = line.split(/(==.+?==)/).map((part, idx) => {
        if (/^==(.+)==$/.test(part)) {
          // * Выделяем цветом
          const highlightedText = part.replace(/==(.+)==/, "$1");
          return (
            <Text
              key={generateUniqueKey(highlightedText, idx)}
              style={styles.highlightStyle}>
              {highlightedText}
            </Text>
          );
        }
        return part;
      });
      elements.push(<Text key={generateUniqueKey(line, index)}>{parts}</Text>);
    }
    // * Списки
    else if (/^\*\s+(.*)/.test(line)) {
      const listItem = line.replace(/^\*\s+/, "");
      elements.push(
        <Text
          key={generateUniqueKey(line, index)}
          style={styles.listsStyle}>
          {"\u2022"} {listItem}
        </Text>,
      );
    } else if (/^-\s+(.*)/.test(line)) {
      const listItem = line.replace(/^-\s+/, "");
      elements.push(
        <Text
          key={generateUniqueKey(line, index)}
          style={styles.listsStyle}>
          {"\u2022"} {listItem}
        </Text>,
      );
    }
    // * Обычный текст
    else {
      elements.push(<Text key={generateUniqueKey(line, index)}>{line}</Text>);
    }
  });

  return elements;
};

export const createMdStyles = () => {
  const styles = StyleSheet.create<TMarkdownStyle>({
    h1Style: { fontSize: 28, fontWeight: "bold" },
    h2Style: { fontSize: 26, fontWeight: "bold" },
    h3Style: { fontSize: 24, fontWeight: "bold" },
    h4Style: { fontSize: 22, fontWeight: "bold" },
    h5Style: { fontSize: 20, fontWeight: "bold" },
    h6Style: { fontSize: 18, fontWeight: "bold" },
    boldTextStyle: { fontWeight: "bold" },
    italicTextStyle: { fontStyle: "italic" },
    listsStyle: { marginLeft: 10 },
    highlightStyle: { backgroundColor: EPalette.YELLOW },
  });
  return styles;
};
