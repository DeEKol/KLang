// CustomTabBar.js
import React from "react";
import { BottomNavigation } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";

export default function PaperBottomTabs({
  navigation,
  state,
  descriptors,
  insets,
  TabBarComponent = BottomNavigation.Bar, // можно заменить внешне
}: any) {
  // memoize, чтобы не пересоздавать функции на каждый рендер
  const onTabPress = React.useCallback(
    ({ route, preventDefault }) => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (event.defaultPrevented) {
        // если кто-то предотвратил переход — вызываем preventDefault
        preventDefault?.();
      } else {
        navigation.dispatch({
          ...CommonActions.navigate(route.name, route.params),
          target: state.key,
        });
      }
    },
    [navigation, state.key],
  );

  const renderIcon = React.useCallback(
    ({ route, focused, color, size = 24 }) => {
      return (
        descriptors[route.key].options.tabBarIcon?.({
          focused,
          color,
          size,
        }) ?? null
      );
    },
    [descriptors],
  );

  const getLabelText = React.useCallback(
    ({ route }) => {
      const { options } = descriptors[route.key];
      const label =
        typeof options.tabBarLabel === "string"
          ? options.tabBarLabel
          : typeof options.title === "string"
            ? options.title
            : route.name;
      return label;
    },
    [descriptors],
  );

  return (
    <TabBarComponent
      navigationState={state}
      safeAreaInsets={insets}
      onTabPress={onTabPress}
      renderIcon={renderIcon}
      getLabelText={getLabelText}
    />
  );
}
