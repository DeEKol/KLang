// ? Library Imports
import React, { type ReactNode } from "react";
import { View } from "react-native";
// ? Layer Imports
import { createMdStyles, parseMarkdown } from "features/Markdown/ui/parseMarkdown";
import { generateUniqueKey } from "features/Markdown/utils/generators";

// ? Types
type TMarkdownProps = {
  text: string;
};

/*
 * Компонент, преобразует md в компоненты react-native
 * @text Текст для преобразования
 */
export const Markdown = (props: TMarkdownProps) => {
  // ? Props From
  const { text } = props;

  // ? Styles
  const markdownStyles = createMdStyles();

  const parsedElements = parseMarkdown(text, markdownStyles).filter((element) => element != null);

  // ? Render
  return (
    <View>
      {parsedElements.map((element: ReactNode, index) => {
        if (React.isValidElement(element)) {
          return <View key={generateUniqueKey(element.props.children, index)}>{element}</View>;
        }
      })}
    </View>
  );
};
