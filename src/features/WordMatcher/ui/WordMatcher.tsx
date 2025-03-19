/* eslint-disable react-native/no-color-literals */
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { ViewStyle } from "react-native";
import { FlatList, NativeEventEmitter, StyleSheet, Text, View } from "react-native";
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
  // activeButton: {
  //   backgroundColor: "#7AC6E973",
  //   padding: 5,
  //   borderRadius: 8,
  // },
  // button: {
  //   padding: 5,
  //   borderRadius: 8,
  // },
});

const Column = ({ words, type, eventEmitter, setValue }: IWordMatcherSchema) => {
  // const onPress = (word: any) => {
  //   eventEmitter.emit(`select-${type}-word`, { word: word.item });
  // };
  const [selectedIdx, setSelectedIdx] = React.useState(0);

  return (
    <View style={type === "native" ? styles.leftColumn : styles.rightColumn}>
      <FlatList
        ItemSeparatorComponent={({ highlighted }) => (
          <View style={[styles.separator, highlighted]} />
        )}
        data={words}
        renderItem={({ item: word, index }) => (
          // <View style={index === selectedIdx ? styles.activeButton : null}>
          <ButtonUI
            key={word}
            title={word}
            // style={index === selectedIdx ? styles.activeButton : styles.button}
            onPress={(e) => {
              console.log("onPress", e.nativeEvent.target);
              setSelectedIdx(index);
              setValue(word);
            }}
          />
          // </View>
        )}
      />
    </View>
  );
};

export const WordMatcher = () => {
  // const eventEmitter = new NativeEventEmitter();

  const [wordsPairs, setPairs] = React.useState<object>({});
  const [leftValue, setLeftValue] = React.useState<string>("");
  const [rightValue, setRightValue] = React.useState<string>("");

  const wordsMap: { [key: string]: string } = {
    Cat: "Кот",
    Dog: "Собака",
    Fish: "Рыба",
    Elephant: "Слон",
  };
  const learningWordsCount = 4;
  const nativeWords = Object.keys(wordsMap);
  const learningWords = Object.values(wordsMap);

  // eventEmitter.addListener("select-native-word", ({ word }) => {
  //   setLeftValue(word);
  // });
  // eventEmitter.addListener("select-learning-word", ({ word }) => {
  //   setRightValue(word);
  // });

  const resetValues = () => {
    setLeftValue("");
    setRightValue("");
  };

  const isMatch = (object: object, map: Record<string, string>) => {
    const entries = Object.entries(object);

    return (
      entries.every(([key, word]) => word === map[key]) && entries.length === learningWordsCount
    );
  };

  useEffect(() => {
    if (!!leftValue && !!rightValue) {
      setPairs({ ...wordsPairs, [leftValue]: rightValue });
      resetValues();
    }
    // console.log(wordsPairs);
  }, [leftValue, rightValue]);

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{"Word Matcher"}</Text>
      <View style={styles.columnContainer}>
        <Column
          // eventEmitter={eventEmitter}
          type="native"
          words={[...nativeWords].reverse()}
          setValue={setLeftValue}
        />
        <Column
          // eventEmitter={eventEmitter}
          type="learning"
          words={learningWords}
          setValue={setRightValue}
        />
      </View>
      {isMatch(wordsPairs, wordsMap) ? (
        <Text style={[styles.textStyle, styles.match]}>{"Match!"}</Text>
      ) : (
        <Text style={[styles.textStyle, styles.notMatch]}>{"Not match"}</Text>
      )}
    </View>
  );
};
