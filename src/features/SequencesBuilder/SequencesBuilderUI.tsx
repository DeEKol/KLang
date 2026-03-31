import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  findNodeHandle,
  Pressable,
  ScrollView,
  Text,
  UIManager,
  View,
} from "react-native";
import { useThemeTokens } from "entities/theme";

import { type TBlankPos } from "./types/sequencesBuilderSchema";
import { Blank } from "./ui/Blank";
import { OptionsRow } from "./ui/OptionsRow";
import { VictoryOverlay } from "./ui/VictoryOverlay";
import createStyles from "./SequencesBuilderUI.styles";

/* ---------------------- Mock / Types ---------------------- */
interface IMockData {
  sentenceParts: string[]; // text parts and placeholders like "__1__"
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

/* ---------------------- Parent component ---------------------- */
export const SequencesBuilderUI: React.FC<{
  playSuccessSound?: () => void;
  playFailSound?: () => void;
}> = ({ playSuccessSound, playFailSound }) => {
  const { colors } = useThemeTokens();
  const { t } = useTranslation("sequencesBuilder");
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [filled, setFilled] = useState<{ [key: number]: { word: string; correct: boolean } }>({});
  const [options, setOptions] = useState<string[]>(mockData.options.slice());
  const [blankPositions, setBlankPositions] = useState<{ [key: number]: TBlankPos }>({});
  const [hints, setHints] = useState<{ [key: number]: "success" | "fail" | null }>({});
  const [victoryVisible, setVictoryVisible] = useState(false);

  const blankRefs = useRef<{ [key: number]: View }>({});
  const blankSetters = useRef(new Map<number, (r: View | null) => void>());

  const getSetBlankRef = useCallback((id: number) => {
    if (!blankSetters.current.has(id)) {
      blankSetters.current.set(id, (r: View | null) => {
        if (r) blankRefs.current[id] = r;
      });
    }
    return blankSetters.current.get(id)!;
  }, []);

  const measureBlank = useCallback((id: number) => {
    const ref = blankRefs.current[id];
    if (!ref) return;
    const apply = (x: number, y: number, width: number, height: number) => {
      const next = { x, y: y + 10, width, height };
      setBlankPositions((prev) => {
        const p = prev[id];
        if (
          p &&
          p.x === next.x &&
          p.y === next.y &&
          p.width === next.width &&
          p.height === next.height
        ) {
          return prev;
        }
        return { ...prev, [id]: next };
      });
    };

    if (typeof ref.measureInWindow === "function") {
      try {
        ref.measureInWindow((x: number, y: number, width: number, height: number) => {
          if (typeof x === "number" && typeof y === "number") apply(x, y, width, height);
        });
      } catch (err) {
        console.error(err);
      }
      return;
    }
    const node = findNodeHandle(ref);
    if (!node) return;
    UIManager.measureInWindow(node, (x: number, y: number, width: number, height: number) => {
      if (typeof x === "number" && typeof y === "number") apply(x, y, width, height);
    });
  }, []);

  const measureAll = useCallback(() => {
    requestAnimationFrame(() => {
      mockData.blanks.forEach((b) => measureBlank(b.id));
    });
  }, [measureBlank]);

  useEffect(() => {
    measureAll();
    const sub = Dimensions.addEventListener?.("change", measureAll) ?? null;
    return () => {
      if (sub && typeof sub.remove === "function") sub.remove();
    };
  }, [measureAll]);

  const showHint = useCallback(
    (id: number, type: "success" | "fail") => {
      setHints((prev) => ({ ...prev, [id]: type }));
      if (type === "success") {
        playSuccessSound?.();
      } else {
        playFailSound?.();
      }
      setTimeout(() => {
        setHints((prev) => ({ ...prev, [id]: null }));
      }, 900);
    },
    [playFailSound, playSuccessSound],
  );

  const handleDrop = useCallback(
    (word: string, blankId: number | undefined) => {
      if (blankId == null) return;
      const correct = mockData.correctAnswers[String(blankId)] === word;
      setFilled((prev) => {
        const before = prev[blankId];
        if (before && before.word === word && before.correct === correct) return prev;
        return { ...prev, [blankId]: { word, correct } };
      });

      if (correct) {
        setOptions((prev) => prev.filter((p) => p !== word));
        showHint(blankId, "success");
      } else {
        showHint(blankId, "fail");
      }
    },
    [showHint],
  );

  const correctCount = useMemo(
    () => Object.values(filled).filter((f) => f.correct).length,
    [filled],
  );

  useEffect(() => {
    if (correctCount === mockData.blanks.length && mockData.blanks.length > 0) {
      setVictoryVisible(true);
    }
  }, [correctCount]);

  const resetAll = useCallback(() => {
    setFilled({});
    setOptions(mockData.options.slice());
    setHints({});
    setVictoryVisible(false);
    setTimeout(() => measureAll(), 80);
  }, [measureAll]);

  return (
    <>
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>{t("title")}</Text>

          <View style={styles.sentenceWrap}>
            <View style={styles.sentenceRow}>
              {mockData.sentenceParts.map((part) => {
                const match = part.match(/__(\d+)__/);
                if (match) {
                  const id = Number(match[1]);
                  return (
                    <Blank
                      key={`blank-${id}`}
                      filled={filled[id]}
                      innerRef={getSetBlankRef(id)}
                      onLayout={() => requestAnimationFrame(() => measureBlank(id))}
                      hint={hints[id] ?? null}
                    />
                  );
                }
                return (
                  <Text
                    key={part}
                    style={styles.sentenceText}>
                    {part}
                  </Text>
                );
              })}
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.score}>
              {t("score", { correct: correctCount, total: mockData.blanks.length })}
            </Text>
            <Pressable
              onPress={resetAll}
              style={({ pressed }) => [styles.resetButton, pressed && styles.resetPressed]}>
              <Text style={styles.resetButtonText}>{t("reset")}</Text>
            </Pressable>
          </View>

          <View style={styles.optionsCard}>
            <Text style={styles.optionsTitle}>{t("optionsTitle")}</Text>
            <OptionsRow
              options={options}
              onDrop={handleDrop}
              blanks={mockData.blanks}
              blankPositions={blankPositions}
            />
            {options.length === 0 && <Text style={styles.hintSmall}>{t("allOptionsUsed")}</Text>}
          </View>
        </View>
      </ScrollView>

      <VictoryOverlay
        visible={victoryVisible}
        onClose={() => setVictoryVisible(false)}
      />
    </>
  );
};
