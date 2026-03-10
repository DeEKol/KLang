import React from "react";
import { StyleSheet, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type BlankPos = { x: number; y: number; width: number; height: number };

type TDraggableWordProps = {
  word: string;
  onDrop: (word: string, blankId: number | undefined) => void;
  blanks: { id: number }[];
  blankPositions: { [key: number]: BlankPos };
};

type ContextType = {
  startX: number;
  startY: number;
};

const SNAP_DURATION = 300; // ms

const DraggableWordUI: React.FC<TDraggableWordProps> = ({
  word,
  onDrop,
  blanks,
  blankPositions,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const isAnimatingToTarget = useSharedValue(false);

  const gestureHandler = Gesture.Pan()
    .onBegin((e) => {
      // e.x = translateX.value;
      // e.y = translateY.value;
      // ensure visible if reused
      opacity.value = 1;
    })
    .onChange((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onFinalize((event) => {
      // if already animating to target, ignore new end
      if (isAnimatingToTarget.value) {
        // short bounce back to zero if needed
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        return;
      }

      const absX = event.absoluteX;
      const absY = event.absoluteY;

      // find target blank if any
      let targetId: number | undefined = undefined;
      let targetCenterX = 0;
      let targetCenterY = 0;

      for (let i = 0; i < blanks.length; i++) {
        const id = blanks[i].id;
        const pos = blankPositions[id];
        if (!pos) continue;
        if (
          absX >= pos.x &&
          absX <= pos.x + pos.width &&
          absY >= pos.y &&
          absY <= pos.y + pos.height
        ) {
          targetId = id;
          targetCenterX = pos.x + pos.width / 2;
          targetCenterY = pos.y + pos.height / 2;
          break;
        }
      }

      if (targetId !== undefined) {
        // compute delta in window coordinates: from touch point -> center of blank
        const deltaX = targetCenterX - absX;
        const deltaY = targetCenterY - absY;

        // now animate translate values by delta (they are relative to element position)
        // we animate current translate + delta
        isAnimatingToTarget.value = true;

        // targetTranslate values (current transl + delta)
        const finalX = translateX.value + deltaX;
        const finalY = translateY.value + deltaY;

        // Animate both; call onDrop when Y animation finishes (both durations same)
        translateX.value = withTiming(finalX, { duration: SNAP_DURATION });
        translateY.value = withTiming(finalY, { duration: SNAP_DURATION }, (isFinished) => {
          if (isFinished) {
            // notify JS thread that drop happened
            scheduleOnRN(onDrop, word, targetId);
            // fade out draggable and reset position after fade
            opacity.value = withTiming(0, { duration: 180 }, () => {
              // reset to origin for future drags
              translateX.value = 0;
              translateY.value = 0;
              isAnimatingToTarget.value = false;
              // restore opacity for reuse (if parent re-renders without removing)
              opacity.value = 1;
            });
          }
        });
      } else {
        // no target — bounce back
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    zIndex: 999,
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={gestureHandler}>
      <Animated.View style={[styles.wordBox, animatedStyle]}>
        <Text style={styles.wordText}>{word}</Text>
      </Animated.View>
    </GestureDetector>
  );
};

export default DraggableWordUI;

const styles = StyleSheet.create({
  wordBox: {
    padding: 12,
    margin: 6,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: "#fff",
  },
  wordText: {
    fontSize: 16,
    fontFamily: "NotoSansKR-Regular",
  },
});
