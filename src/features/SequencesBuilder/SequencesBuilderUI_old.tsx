import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, findNodeHandle, StyleSheet, Text, UIManager, View } from "react-native";

import { Blank } from "./ui/Blank";
import DraggableWordUI from "./ui/DraggableWordUI";

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

type BlankPos = { x: number; y: number; width: number; height: number };

const SequencesBuilderUI: React.FC = () => {
  const [filledBlanks, setFilledBlanks] = useState<{
    [key: number]: { word: string; correct: boolean };
  }>({});
  const [blankPositions, setBlankPositions] = useState<{ [key: number]: BlankPos }>({});

  // refs to native components for measuring
  const blankRefs = useRef<{ [key: number]: any }>({});

  // measure + only set state when something actually changed
  const measureBlankPosition = useCallback((blankId: number) => {
    const ref = blankRefs.current[blankId];
    if (!ref) return;

    const apply = (x: number, y: number, width: number, height: number) => {
      const newPos = { x, y: y + 10, width, height };
      setBlankPositions((prev) => {
        const prevPos = prev[blankId];
        // if identical, don't create new object / don't set state
        if (
          prevPos &&
          prevPos.x === newPos.x &&
          prevPos.y === newPos.y &&
          prevPos.width === newPos.width &&
          prevPos.height === newPos.height
        ) {
          return prev;
        }
        // otherwise update
        return { ...prev, [blankId]: newPos };
      });
    };

    if (typeof ref.measureInWindow === "function") {
      try {
        ref.measureInWindow((x: number, y: number, width: number, height: number) => {
          if (typeof x === "number" && typeof y === "number") apply(x, y, width, height);
        });
      } catch {
        // ignore measurement errors silently
      }
      return;
    }

    const node = findNodeHandle(ref);
    if (!node) return;
    UIManager.measureInWindow(node, (x: number, y: number, width: number, height: number) => {
      if (typeof x === "number" && typeof y === "number") apply(x, y, width, height);
    });
  }, []);

  const handleWordDrop = (word: string, blankId: number | undefined) => {
    if (blankId == null) return;
    const isCorrect = mockData.correctAnswers[String(blankId)] === word;
    // пример: обновляем filledBlanks только если изменилось значение
    setFilledBlanks((prev) => {
      const prevForId = prev[blankId];
      if (prevForId && prevForId.word === word && prevForId.correct === isCorrect) {
        return prev;
      }
      return { ...prev, [blankId]: { word, correct: isCorrect } };
    });
  };

  useEffect(() => {
    // measure after mount — через RAF, чтобы layout точно успел завершиться
    const raf = requestAnimationFrame(() => {
      mockData.blanks.forEach((b) => measureBlankPosition(b.id));
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onChange = () => {
      // измеряем после изменения размеров экрана с RAF
      const raf = requestAnimationFrame(() => {
        mockData.blanks.forEach((b) => measureBlankPosition(b.id));
      });
      return () => cancelAnimationFrame(raf);
    };

    const sub = Dimensions.addEventListener?.("change", onChange) ?? null;
    return () => {
      if (sub && typeof sub.remove === "function") sub.remove();
    };
    // measureBlankPosition стабильный (useCallback no deps) — если добавите deps, учтите это
  }, [measureBlankPosition]);

  const renderSentence = useCallback(
    () =>
      mockData.sentenceParts.map((part, idx) => {
        const match = part.match(/__(\d+)__/);
        if (match) {
          const id = Number(match[1]);
          const filled = filledBlanks[id];

          return (
            <Blank
              key={`blank-${id}`}
              id={id}
              filled={filled}
              innerRef={(r) => {
                if (r) blankRefs.current[id] = r;
              }}
              // запускаем измерение через RAF чтобы не создавать гонок onLayout -> setState -> onLayout
              onLayout={() => {
                requestAnimationFrame(() => measureBlankPosition(id));
              }}
            />
          );
        }

        return (
          <Text
            key={`text-${idx}`}
            style={styles.sentenceText}>
            {part}
          </Text>
        );
      }),
    [filledBlanks, measureBlankPosition],
  );

  return (
    <View style={styles.container}>
      <View style={styles.sentenceContainer}>{renderSentence()}</View>

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
    backgroundColor: "black",
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
  sentence: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: "NotoSansKR-Regular",
    color: "#fff",
  },
  sentenceText: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: "NotoSansKR-Regular",
    color: "#fff",
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
    margin: 4,
    borderColor: "red",
    borderWidth: 1,
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
