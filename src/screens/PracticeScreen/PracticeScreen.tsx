import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import type { ListRenderItem } from "react-native";
import { FlatList, StyleSheet, View } from "react-native";
import { practicesModel, type TPracticesModel } from "screens/PracticeScreen/models/practicesModel";
import type { ENavigation, TPracticeStackScreenProps } from "shared/config/navigation";
import { Button } from "shared/ui/paper-kit";

const Separator = memo(() => <View style={styles.separator} />);
Separator.displayName = "Separator";

export const PracticeScreen = (props: TPracticeStackScreenProps<ENavigation.PRACTICE>) => {
  // ? Props
  const { navigation } = props;

  // ? Hooks
  const { t } = useTranslation("practiceScreen");

  const renderItem: ListRenderItem<TPracticesModel> = ({ item }) => (
    <Button
      key={item.key}
      onPress={() => navigation.navigate(item.navigate)}>
      {t(item.title)}
    </Button>
  );

  return (
    <View>
      <FlatList
        data={practicesModel}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator}
        keyExtractor={(item) => item.key} // Уникальный ключ для каждого элемента
      />
    </View>
  );
};

const styles = StyleSheet.create({
  separator: {
    marginVertical: 8,
    // borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
