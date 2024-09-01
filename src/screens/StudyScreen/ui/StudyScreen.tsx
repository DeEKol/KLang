// ? Library Imports
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
// ? Layer Imports
import type { TRootStackParamList } from "app/providers/NavigationProvider";
import { levelsModel } from "screens/StudyScreen/models/levelsModel";
import { ButtonUI } from "shared/ui";

// ? Types
type TStudyScreenProps = NativeStackScreenProps<TRootStackParamList, "StudyScreen">;

export const StudyScreen = ({ navigation }: TStudyScreenProps) => {
  // ? Hooks
  const { t } = useTranslation("studyScreen");

  // ? Render
  return (
    <View>
      <Text>{t("Levels")}</Text>

      {/* Iterate over the model */}
      {levelsModel &&
        Object.entries(levelsModel).map(([key, { title, navigate }]) => (
          <ButtonUI
            key={key}
            title={t(title)}
            onPress={() => navigation.navigate(navigate)}
          />
        ))}
    </View>
  );
};
