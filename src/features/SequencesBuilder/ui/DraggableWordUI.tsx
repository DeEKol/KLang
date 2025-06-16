import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

type TDraggableWordProps = {
  word: string;
  onDrop: (word: string, blankId: string | undefined) => void;
  blanks: { id: number }[];
  blankPositions: { [key: string]: { x: number; y: number; width: number; height: number } };
};

const DraggableWord = ({ word, onDrop, blanks, blankPositions }: TDraggableWordProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    zIndex: 999,
  }));

  return (
    <PanGestureHandler
      onGestureEvent={({ nativeEvent }) => {
        translateX.value = nativeEvent.translationX;
        translateY.value = nativeEvent.translationY;
      }}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
          const targetBlank = blanks.find((blank) => {
            const pos = blankPositions[blank.id];
            if (!pos) return false;

            return (
              nativeEvent.absoluteX >= pos.x &&
              nativeEvent.absoluteX <= pos.x + pos.width &&
              nativeEvent.absoluteY >= pos.y &&
              nativeEvent.absoluteY <= pos.y + pos.height
            );
          });

          onDrop(word, targetBlank?.id);
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
        }
      }}>
      <Animated.View style={[styles.wordBox, animatedStyle]}>
        <Text style={styles.wordText}>{word}</Text>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  wordBox: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    elevation: 3,
  },
  wordText: {
    fontSize: 16,
    fontFamily: "NotoSansKR-Regular",
  },
});

export default DraggableWord;
