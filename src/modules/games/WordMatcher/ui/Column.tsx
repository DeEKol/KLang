import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, FlatList, Platform, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { useFadeScale } from "../model/animation/useFadeScale";

import Word from "./Word";

// -----------------------------------
// Types
// -----------------------------------
export interface ColumnProps {
  words: string[];
  value: string;
  setValue: (value: string) => void;
  errorPair: [string, string] | null;
  side: "left" | "right";
  celebrate: boolean;
  isMatchComplete: boolean;
}

// -----------------------------------
// Component
// -----------------------------------
const Column: React.FC<ColumnProps> = ({
  words,
  value,
  setValue,
  errorPair,
  side,
  celebrate,
  isMatchComplete,
}) => {
  const animStyle = useFadeScale(!isMatchComplete);

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <Word
        word={item}
        celebrate={celebrate}
        onPress={() => setValue(item)}
        isSelected={value === item}
        isError={errorPair ? item === (side === "left" ? errorPair[0] : errorPair[1]) : false}
      />
    ),
    [celebrate, setValue, value, errorPair, side],
  );

  const gradientColors = useMemo(() => ["#f8f9fa", "#e9ecef"], []);

  return (
    <Animated.View style={[styles.column, animStyle]}>
      <LinearGradient
        colors={gradientColors}
        style={[styles.column, styles.columnShadow]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <FlatList
          data={words}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </LinearGradient>
    </Animated.View>
  );
};

// -----------------------------------
// Styles
// -----------------------------------
const styles = StyleSheet.create({
  column: {
    flex: 1,
    width: "100%",
    borderRadius: 12,
    padding: 6,
  },
  columnShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  separator: {
    height: 12,
  },
});

export default Column;
