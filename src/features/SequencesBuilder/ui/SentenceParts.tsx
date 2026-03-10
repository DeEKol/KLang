import React from "react-native";

const { View, Text } = React;

export const SentenceParts = ({
  parts,
  blankRefs,
  filledBlanks,
  measureBlankPosition,
}: {
  parts: string[];
  blankRefs: { [key: string]: View | null };
  filledBlanks: { [key: string]: { word: string; correct: boolean } };
  measureBlankPosition: (id: number) => void;
}) => {
  return parts.map((part, index) => {
    if (part.match(/__\d+__/)) {
      const blankId = part.match(/__(\d+)__/)?.[1];

      if (!blankId) return <></>;

      const filled = filledBlanks[blankId];

      return (
        <View
          key={index}
          ref={(ref) => {
            if (ref) {
              blankRefs.current[blankId] = ref;
            }
          }}
          onLayout={() => measureBlankPosition(+blankId)}
          style={[
            styles.blankContainer,
            filled?.correct !== undefined &&
              (filled?.correct ? styles.correctBlank : styles.incorrectBlank),
          ]}>
          <Text style={styles.blankText}>{filled?.word || "______"}</Text>
        </View>
      );
    }

    return (
      <Text
        key={index}
        style={styles.sentenceText}>
        {part}
      </Text>
    );
  });
};
