import React from "react";
import { useTranslation } from "react-i18next";
import type { ListRenderItem } from "react-native";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { practicesModel, type TPracticesModel } from "screens/PracticeScreen/models/practicesModel";
import { ButtonUI } from "shared/ui/atoms";

export const PracticeScreen = ({ navigation }: any) => {
  const { t } = useTranslation("practiceScreen");

  const renderItem: ListRenderItem<TPracticesModel> = ({ item }) => (
    <ButtonUI
      key={item.key}
      title={t(item.title)}
      onPress={() => navigation.navigate(item.navigate)}
    />
  );

  const Separator = () => <View style={styles.separator} />;

  return (
    <View>
      <Text>{t("Go to practice!")}</Text>

      {/* Iterate over the model */}
      <FlatList
        data={practicesModel}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Separator />}
        keyExtractor={(item) => item.key} // Уникальный ключ для каждого элемента
      />
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
