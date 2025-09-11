import React from "react";
import { useTranslation } from "react-i18next";
import type { ListRenderItem } from "react-native";
import { FlatList, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { TPracticeStackParamList } from "app/providers/NavigationProvider";
import { practicesModel, type TPracticesModel } from "screens/PracticeScreen/models/practicesModel";
import { ButtonUI } from "shared/ui/atoms";

export type TLevelScreenProps = NativeStackScreenProps<TPracticeStackParamList>;

export const PracticeScreen = (props: TLevelScreenProps) => {
  // ? Props
  const { navigation } = props;

  // ? Hooks
  const { t } = useTranslation("practiceScreen");

  const renderItem: ListRenderItem<TPracticesModel> = ({ item }) => (
    <ButtonUI
      key={item.key}
      title={t(item.title)}
      onPress={() => navigation.navigate(item.navigate as keyof TPracticeStackParamList)}
    />
  );

  const Separator = () => <View style={styles.separator} />;

  return (
    <View>
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
