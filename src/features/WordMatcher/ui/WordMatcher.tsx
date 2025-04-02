import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, View, type ViewStyle } from "react-native";
import type { IWordMatcherSchema } from "features/WordMatcher";
import { ButtonUI } from "shared/ui/atoms";

const columnDefaultStyle: ViewStyle = {
  width: "50%",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  padding: 20,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  columnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    // borderColor: "#54A1F8",
    borderWidth: 1,
  },
  leftColumn: {
    ...columnDefaultStyle,
    backgroundColor: "#BCFFA18A",
    borderRightWidth: 1,
  },
  rightColumn: {
    ...columnDefaultStyle,
    backgroundColor: "#C5ECFF8A",
  },
  textStyle: {
    padding: 5,
    fontWeight: "bold",

    color: "#4234AA",
    textAlign: "center",
    fontSize: 20,

    backgroundColor: "#60ABE5A6",
  },
  match: {
    backgroundColor: "#7DFF9573",
  },
  notMatch: {
    backgroundColor: "#FF7D7773",
  },
  separator: {
    height: 10,
  },
});

const Column = ({ words, type, eventEmitter, setValue }: IWordMatcherSchema) => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <View style={type === "native" ? styles.leftColumn : styles.rightColumn}>
      <FlatList
        keyExtractor={(item) => item}
        ItemSeparatorComponent={({ highlighted }) => (
          <View style={[styles.separator, highlighted]} />
        )}
        data={words}
        renderItem={({ item: word, index }) => (
          <ButtonUI
            title={word}
            style={(state: { pressed: boolean }) => {
              if (state.pressed) {
                return [styles.textStyle, styles.match];
              }
            }}
            onPress={(e) => {
              setSelectedIdx(index);
              setValue(word);
            }}
          />
        )}
      />
    </View>
  );
};

export const WordMatcher = () => {
  const wordsMap: { [key: string]: string } = {
    Cat: "Кот",
    Dog: "Собака",
    Fish: "Рыба",
    Elephant: "Слон",
  };

  const [filteredNative, setFilteredNative] = useState(Object.keys(wordsMap));
  const [filteredLearning, setFilteredLearning] = useState(Object.values(wordsMap));

  const [leftValue, setLeftValue] = useState<string>("");
  const [rightValue, setRightValue] = useState<string>("");

  useEffect(() => {
    if (leftValue && rightValue) {
      if (wordsMap[leftValue] === rightValue) {
        setFilteredNative((prev) => prev.filter((w) => w !== leftValue));
        setFilteredLearning((prev) => prev.filter((w) => w !== rightValue));
      }
      setLeftValue("");
      setRightValue("");
    }
  }, [leftValue, rightValue]);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{"Word Matcher"}</Text>
      <View style={styles.columnContainer}>
        <Column
          type="native"
          words={[...filteredNative].reverse()}
          setValue={setLeftValue}
        />
        <Column
          type="learning"
          words={[...filteredLearning]}
          setValue={setRightValue}
        />
      </View>
      {filteredNative.length === 0 && filteredLearning.length === 0 ? (
        <Text style={[styles.textStyle, styles.match]}>{"Match!"}</Text>
      ) : (
        <Text style={[styles.textStyle, styles.notMatch]}>{"Not match"}</Text>
      )}
    </View>
  );
};
