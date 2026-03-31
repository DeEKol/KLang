import React, { useMemo } from "react";
import { Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useThemeTokens } from "entities/theme";

import { type TBlankPos } from "../types/sequencesBuilderSchema";

import createStyles from "./DraggableWord.styles";

const SNAP_DURATION = 300;

type TDraggableWordProps = {
  word: string;
  onDrop: (word: string, blankId: number | undefined) => void;
  blanks: { id: number }[];
  blankPositions: { [key: number]: TBlankPos };
  disabled?: boolean;
};

export const DraggableWord: React.FC<TDraggableWordProps> = ({
  word,
  onDrop,
  blanks,
  blankPositions,
  disabled,
}) => {
  const { colors } = useThemeTokens();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
              scheduleOnRN(onDrop, word, targetId);
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.chip, disabled && styles.chipDisabled, animatedStyle]}>
        <Text style={[styles.chipText, disabled && styles.chipTextDisabled]}>{word}</Text>
      </Animated.View>
    </GestureDetector>
  );
};
