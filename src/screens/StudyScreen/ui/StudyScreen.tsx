// ? Library Imports
import React from "react";
import { useTranslation } from "react-i18next";
import type { ListRenderItem } from "react-native";
import { FlatList, Text, View } from "react-native";
// ? Layer Imports
import type { TStudyStackScreenProps } from "app/providers/NavigationProvider";
import { lessonsModel } from "screens/StudyScreen/models/lessonsModel";
import type { TLevelsModel } from "screens/StudyScreen/models/levelsModel";
// import { levelsModel } from "screens/StudyScreen/models/levelsModel";
import { ButtonUI, RoadMapButtonUi } from "shared/ui/atoms";

// ? Types
type TStudyScreenProps = TStudyStackScreenProps;

export const StudyScreen = ({ navigation }: TStudyScreenProps) => {
  // ? Hooks
  const { t } = useTranslation("studyScreen");

  // ? Renders
  // * Функция рендеринга каждого элемента FlatList
  const renderLevel: ListRenderItem<TLevelsModel> = ({ item }) => (
    // <ButtonUI
    //   key={item.key}
    //   title={t(item.title)}
    //   onPress={() => navigation.navigate(item.navigate)}
    // />
    <RoadMapButtonUi
      text={t(item.title)}
      key={item.key}
      // title={t(item.title)}
      onPress={() => navigation.navigate(item.navigate)}
    />
  );

  return (
    <View>
      <Text>{t("Levels")}</Text>

      {/* Iterate over the model */}
      <FlatList
        data={lessonsModel}
        renderItem={renderLevel}
        keyExtractor={(item) => item.key} // Уникальный ключ для каждого элемента
      />
    </View>
  );
};
