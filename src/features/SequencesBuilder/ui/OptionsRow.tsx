import React from "react";
import { StyleSheet, View } from "react-native";

import { type TBlankPos } from "../types/sequencesBuilderSchema";

import { DraggableWord } from "./DraggableWord";

type TOptionsRowProps = {
  options: string[];
  onDrop: (word: string, blankId: number | undefined) => void;
  blanks: { id: number }[];
  blankPositions: { [key: number]: TBlankPos };
};

export const OptionsRow: React.FC<TOptionsRowProps> = ({
  options,
  onDrop,
  blanks,
  blankPositions,
}) => (
  <View style={styles.optionsWrap}>
    {options.map((opt) => (
      <DraggableWord
        key={opt}
        word={opt}
        onDrop={onDrop}
        blanks={blanks}
        blankPositions={blankPositions}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
