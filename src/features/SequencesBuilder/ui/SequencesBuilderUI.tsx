import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

import DraggableWordUI from "./DraggableWordUI";

interface IMockData {
  sentenceParts: string[];
  correctAnswers: { [key: string]: string };
  options: string[];
  blanks: { id: number }[];
}

const mockData: IMockData = {
  sentenceParts: ["저는 ", "__1__", "을 학교에 가고 ", "__2__", "은 집에 있어요"],
  correctAnswers: { 1: "책", 2: "고양이" },
  options: ["책", "컴퓨터", "고양이", "자동차"],
  blanks: [{ id: 1 }, { id: 2 }],
};

const SequencesBuilderUI = () => {
  const [filledBlanks, setFilledBlanks] = useState<{
    [key: string]: { word: string; correct: boolean };
  }>({});
  const [blankPositions, setBlankPositions] = useState<{
    [key: string]: { x: number; y: number; width: number; height: number };
  }>({});
  const blankRefs = useRef<{ [key: string]: React.MutableRefObject<View> }>({});

  const measureBlankPosition = (blankId: string) => {
    const ref = blankRefs.current[blankId];

    if (ref && ref.measureInWindow) {
      ref.measureInWindow((x: number, y: number, width: number, height: number): void => {
        if (x && y) {
          setBlankPositions((prev) => ({
            ...prev,
            [blankId]: { x, y: y + 10, width, height },
          }));
        }
      });
    }
  };

  const handleWordDrop = (word: string, blankId: string | undefined) => {
    if (!blankId) return;
    const isCorrect = mockData.correctAnswers[blankId] === word;
    setFilledBlanks((prev) => ({ ...prev, [blankId]: { word, correct: isCorrect } }));
  };

  const renderSentence = () => {
    return mockData.sentenceParts.map((part, index) => {
      if (part.startsWith("__")) {
        const blankId = part.match(/\d+/)[0];
        const filled = filledBlanks[blankId];

        return (
          <View
            key={`blank-${blankId}`}
            ref={(ref) => (blankRefs.current[blankId] = ref)}
            onLayout={() => measureBlankPosition(blankId)}
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
          key={`text-${index}`}
          style={styles.sentenceText}>
          {part}
        </Text>
      );
    });
  };

  useEffect(() => {
    mockData.blanks.forEach((blank) => measureBlankPosition(blank.id));
  }, [filledBlanks]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      mockData.blanks.forEach((blank) => measureBlankPosition(blank.id));
    });
    return () => subscription?.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.sentenceContainer}>
        <Text style={styles.sentence}>{renderSentence()}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {mockData.options.map((word) => (
          <DraggableWordUI
            key={word}
            word={word}
            blanks={mockData.blanks}
            blankPositions={blankPositions}
            onDrop={handleWordDrop}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  sentenceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 40,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  sentenceText: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: "NotoSansKR-Regular",
    color: "#333",
  },
  blankContainer: {
    backgroundColor: "#e3f2fd",
    borderRadius: 4,
    marginHorizontal: 2,
    paddingHorizontal: 8,
    minWidth: 60,
  },
  blankText: {
    color: "#1976d2",
    // margin: 4,
    // borderColor: "red",
    // borderWidth: 1,
    textAlign: "center",
  },
  correctBlank: {
    backgroundColor: "#c8e6c9",
  },
  incorrectBlank: {
    backgroundColor: "#ffcdd2",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
});

export { SequencesBuilderUI };
