// SequencesBuilderEnhanced.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  findNodeHandle,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  Vibration,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

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

type BlankPos = { x: number; y: number; width: number; height: number };

/* ---------------------- Small helpers ---------------------- */
const SNAP_DURATION = 300;

/* ---------------------- Blank component ---------------------- */
type BlankProps = {
  id: number;
  filled?: { word: string; correct: boolean } | undefined;
  innerRef?: (r: any) => void;
  onLayout?: () => void;
  hint?: "success" | "fail" | null;
};

const Blank: React.FC<BlankProps> = ({ id, filled, innerRef, onLayout, hint }) => {
  // highlight progress for background
  const bgProgress = useSharedValue(0);
  // icon progress
  const iconProgress = useSharedValue(0);
  const iconScale = useSharedValue(0.2);

  useEffect(() => {
    if (hint === "success") {
      // green flash + icon
      bgProgress.value = withTiming(1, { duration: 160 });
      iconProgress.value = withDelay(
        80,
        withTiming(1, { duration: 240, easing: Easing.out(Easing.ease) }),
      );
      iconScale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.back(2)) });
      const t = setTimeout(() => {
        bgProgress.value = withTiming(0, { duration: 340 });
        iconProgress.value = withTiming(0, { duration: 200 });
        iconScale.value = withTiming(0.2, { duration: 200 });
      }, 900);
      return () => clearTimeout(t);
    } else if (hint === "fail") {
      bgProgress.value = withTiming(1, { duration: 120 });
      iconProgress.value = withTiming(1, { duration: 160 });
      iconScale.value = withTiming(1, { duration: 220 });
      const t = setTimeout(() => {
        bgProgress.value = withTiming(0, { duration: 300 });
        iconProgress.value = withTiming(0, { duration: 200 });
        iconScale.value = withTiming(0.2, { duration: 200 });
      }, 700);
      return () => clearTimeout(t);
    }
    // reset if null
    bgProgress.value = withTiming(0, { duration: 200 });
    iconProgress.value = withTiming(0, { duration: 200 });
    iconScale.value = withTiming(0.2, { duration: 200 });
  }, [hint, bgProgress, iconProgress, iconScale]);

  const animatedBg = useAnimatedStyle(() => {
    // interpolate two simple colours by progress
    if (filled?.correct) {
      const alpha = bgProgress.value;
      return { backgroundColor: `rgba(46,125,50, ${0.12 * alpha})` };
    }
    // when hint is fail make red
    if (hint === "fail") {
      const alpha = bgProgress.value;
      return { backgroundColor: `rgba(211,47,47, ${0.12 * alpha})` };
    }
    return { backgroundColor: "transparent" };
  });

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconProgress.value,
    transform: [{ scale: iconScale.value }],
    position: "absolute",
    right: -8,
    top: -8,
  }));

  return (
    <Animated.View
      ref={(r) => innerRef && innerRef(r)}
      onLayout={onLayout}
      style={[styles.blankContainer, animatedBg]}>
      <Text style={[styles.blankText, filled ? styles.blankWord : styles.blankPlaceholder]}>
        {filled?.word ?? "____"}
      </Text>

      {/* Icon overlay */}
      {/**
       * Use simple Text icons (✅ ❌) to avoid extra image assets.
       * Alternatively you can replace with <Svg> or Image.
       */}
      <Animated.View
        style={iconStyle}
        pointerEvents="none">
        <Text style={{ fontSize: 18 }}>
          {filled?.correct || hint === "success" ? "✅" : hint === "fail" ? "❌" : ""}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

/* ---------------------- DraggableWord ---------------------- */
type TDraggableWordProps = {
  word: string;
  onDrop: (word: string, blankId: number | undefined) => void;
  blanks: { id: number }[];
  blankPositions: { [key: number]: BlankPos };
  disabled?: boolean;
};

const DraggableWord: React.FC<TDraggableWordProps> = ({
  word,
  onDrop,
  blanks,
  blankPositions,
  disabled,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const animating = useSharedValue(false);

  const gesture = useMemo(() => {
    return Gesture.Pan()
      .onBegin(() => {
        if (disabled) return;
        scale.value = withTiming(1.06, { duration: 120 });
        opacity.value = 1;
      })
      .onChange((e) => {
        if (disabled) return;
        translateX.value = e.translationX;
        translateY.value = e.translationY;
      })
      .onFinalize((e) => {
        if (disabled) {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          scale.value = withTiming(1, { duration: 120 });
          return;
        }
        if (animating.value) {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          scale.value = withTiming(1, { duration: 120 });
          return;
        }

        const absX = e.absoluteX;
        const absY = e.absoluteY;
        let targetId: number | undefined;
        let centerX = 0;
        let centerY = 0;

        for (let i = 0; i < blanks.length; i++) {
          const id = blanks[i].id;
          const p = blankPositions[id];
          if (!p) continue;
          if (absX >= p.x && absX <= p.x + p.width && absY >= p.y && absY <= p.y + p.height) {
            targetId = id;
            centerX = p.x + p.width / 2;
            centerY = p.y + p.height / 2;
            break;
          }
        }

        if (targetId !== undefined) {
          animating.value = true;
          const dx = centerX - absX;
          const dy = centerY - absY;
          const finalX = translateX.value + dx;
          const finalY = translateY.value + dy;

          translateX.value = withTiming(finalX, { duration: SNAP_DURATION });
          translateY.value = withTiming(finalY, { duration: SNAP_DURATION }, (finished) => {
            if (finished) {
              // call parent
              runOnJS(onDrop)(word, targetId);
              // fade out and reset
              opacity.value = withTiming(0, { duration: 160 }, () => {
                translateX.value = 0;
                translateY.value = 0;
                opacity.value = 1;
                animating.value = false;
                scale.value = 1;
              });
            }
          });
        } else {
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
          scale.value = withTiming(1, { duration: 140 });
        }
      });
  }, [blanks, blankPositions, word, onDrop, animating, disabled]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.chip, style, disabled && styles.chipDisabled]}>
        <Text style={[styles.chipText, disabled && { opacity: 0.5 }]}>{word}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

/* ---------------------- OptionsRow ---------------------- */
const OptionsRow: React.FC<{
  options: string[];
  onDrop: (word: string, blankId: number | undefined) => void;
  blanks: { id: number }[];
  blankPositions: { [key: number]: BlankPos };
}> = ({ options, onDrop, blanks, blankPositions }) => {
  return (
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
};

/* ---------------------- Victory animation (simple) ---------------------- */
const VictoryOverlay: React.FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose,
}) => {
  const scale = useSharedValue(0.2);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.back(2)) });
      opacity.value = withTiming(1, { duration: 300 });
      // auto hide after some time
      const t = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(t);
    } else {
      // reset
      cancelAnimation(scale);
      cancelAnimation(opacity);
      scale.value = 0.2;
      opacity.value = 0;
    }
  }, [visible, scale, opacity, onClose]);

  const st = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;
  return (
    <View
      style={styles.victoryOverlay}
      pointerEvents="none">
      <Animated.View style={[styles.victoryCard, st]}>
        <Text style={styles.victoryText}>🎉 Отлично! 🎉</Text>
        <Text style={styles.victorySub}>Вы правильно заполнили все бланки</Text>
      </Animated.View>
    </View>
  );
};

/* ---------------------- Parent component ---------------------- */
export const SequencesBuilderUI: React.FC<{
  // optional sound callbacks — не обязательны, передайте функции, если хотите звук
  playSuccessSound?: () => void;
  playFailSound?: () => void;
}> = ({ playSuccessSound, playFailSound }) => {
  const [filled, setFilled] = useState<{ [key: number]: { word: string; correct: boolean } }>({});
  const [options, setOptions] = useState<string[]>(mockData.options.slice());
  const [blankPositions, setBlankPositions] = useState<{ [key: number]: BlankPos }>({});
  const [hints, setHints] = useState<{ [key: number]: "success" | "fail" | null }>({});
  const [victoryVisible, setVictoryVisible] = useState(false);

  const blankRefs = useRef<{ [key: number]: any }>({});
  const blankSetters = useRef(new Map<number, (r: any) => void>());

  const getSetBlankRef = useCallback((id: number) => {
    if (!blankSetters.current.has(id)) {
      blankSetters.current.set(id, (r: any) => {
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
      } catch {}
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

  // show hint helper (automatically clears after 900ms)
  const showHint = useCallback(
    (id: number, type: "success" | "fail") => {
      setHints((prev) => ({ ...prev, [id]: type }));
      // vibrate briefly
      if (type === "success") {
        // Vibration.vibrate(60);
        playSuccessSound?.();
      } else {
        // Vibration.vibrate([10, 40, 10]);
        playFailSound?.();
      }
      setTimeout(() => {
        setHints((prev) => ({ ...prev, [id]: null }));
      }, 900);
    },
    [playFailSound, playSuccessSound],
  );

  // stable drop handler from DraggableWord (called via runOnJS)
  const handleDrop = useCallback(
    (word: string, blankId: number | undefined) => {
      if (blankId == null) return;
      const correct = mockData.correctAnswers[String(blankId)] === word;
      // set filled only if changed
      setFilled((prev) => {
        const before = prev[blankId];
        if (before && before.word === word && before.correct === correct) return prev;
        return { ...prev, [blankId]: { word, correct } };
      });

      // show hint and optionally mutate options
      if (correct) {
        // remove option so it can't be reused
        setOptions((prev) => prev.filter((p) => p !== word));
        showHint(blankId, "success");
      } else {
        // keep options available
        showHint(blankId, "fail");
      }
    },
    [showHint],
  );

  // compute score & victory
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
    // re-measure (small delay)
    setTimeout(() => measureAll(), 80);
  }, [measureAll]);

  return (
    <>
      <ScrollView contentContainerStyle={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Корейская практика — вставьте пропущенные слова</Text>

          <View style={styles.sentenceWrap}>
            <View style={styles.sentenceRow}>
              {mockData.sentenceParts.map((part, idx) => {
                const match = part.match(/__(\d+)__/);
                if (match) {
                  const id = Number(match[1]);
                  return (
                    <Blank
                      key={id}
                      id={id}
                      filled={filled[id]}
                      innerRef={getSetBlankRef(id)}
                      onLayout={() => requestAnimationFrame(() => measureBlank(id))}
                      hint={hints[id] ?? null}
                    />
                  );
                }
                return (
                  <Text
                    key={idx}
                    style={styles.sentenceText}>
                    {part}
                  </Text>
                );
              })}
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              Правильно: {correctCount}/{mockData.blanks.length}
            </Text>
            <Pressable
              onPress={resetAll}
              style={({ pressed }) => [styles.resetButton, pressed && styles.resetPressed]}>
              <Text style={styles.resetText}>Сброс</Text>
            </Pressable>
          </View>

          <View style={styles.optionsCard}>
            <Text style={styles.optionsTitle}>Варианты</Text>
            <OptionsRow
              options={options}
              onDrop={handleDrop}
              blanks={mockData.blanks}
              blankPositions={blankPositions}
            />
            {options.length === 0 && (
              <Text style={styles.hintSmall}>Все варианты использованы</Text>
            )}
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

/* ---------------------- Styles ---------------------- */
const styles = StyleSheet.create({
  screen: {
    padding: 18,
    alignItems: "center",
    paddingBottom: 80,
    backgroundColor: "#071026",
    minHeight: "100%",
  },
  card: {
    width: "100%",
    maxWidth: 960,
    backgroundColor: "#071226",
    padding: 18,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    color: "#e6eef8",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },

  sentenceWrap: {
    backgroundColor: "#061428",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  sentenceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  sentenceText: {
    color: "#eef6ff",
    fontSize: 18,
    lineHeight: 28,
    marginHorizontal: 2,
  },

  blankContainer: {
    minWidth: 70,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#081425",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.03)",
    alignItems: "center",
    justifyContent: "center",
  },
  blankText: {
    fontSize: 17,
  },
  blankPlaceholder: {
    color: "#8ea6c4",
  },
  blankWord: {
    color: "#dff1ff",
    fontWeight: "700",
  },

  optionsCard: {
    marginTop: 6,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#061025",
  },
  optionsTitle: {
    color: "#a9c6e0",
    marginBottom: 8,
    fontSize: 14,
  },
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  chip: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    margin: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  chipDisabled: {
    backgroundColor: "#dfe7ee",
  },
  chipText: {
    color: "#071022",
    fontWeight: "600",
  },

  metaRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaText: {
    color: "#9fb4d6",
  },
  resetButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#15314a",
  },
  resetPressed: {
    opacity: 0.8,
  },
  resetText: {
    color: "#dff1ff",
  },

  hintSmall: {
    color: "#9fb4d6",
    marginTop: 8,
    fontSize: 13,
  },

  victoryOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  victoryCard: {
    backgroundColor: "#0b2b1f",
    padding: 22,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#2ecc71",
    alignItems: "center",
  },
  victoryText: {
    fontSize: 22,
    color: "#e6fff1",
    fontWeight: "700",
  },
  victorySub: {
    color: "#c9f5d6",
    marginTop: 4,
  },
});
