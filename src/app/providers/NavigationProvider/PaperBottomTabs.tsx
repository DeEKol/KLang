import type { ComponentType } from "react";
import React from "react";
import { BottomNavigation } from "react-native-paper";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";

type BarProps = React.ComponentProps<typeof BottomNavigation.Bar>;
type BaseRoute = BarProps["navigationState"]["routes"][number];
type BarRoute = BaseRoute & { name: string; params?: Record<string, unknown> };

interface Props extends BottomTabBarProps {
  TabBarComponent?: ComponentType<BarProps>;
}

export default function PaperBottomTabs({
  navigation,
  state,
  descriptors,
  insets,
  TabBarComponent = BottomNavigation.Bar, // можно заменить внешне
}: Props) {
  // memoize, чтобы не пересоздавать функции на каждый рендер
  const onTabPress = React.useCallback(
    ({ route, preventDefault }: { route: BaseRoute; preventDefault: () => void }) => {
      const { name, params } = route as BarRoute;
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
          ...CommonActions.navigate(name, params),
          target: state.key,
        });
      }
    },
    [navigation, state.key],
  );

  const renderIcon = React.useCallback(
    ({
      route,
      focused,
      color,
      size = 24,
    }: {
      route: BaseRoute;
      focused: boolean;
      color: string;
      size?: number;
    }) => {
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
    ({ route }: { route: BaseRoute }) => {
      const { options } = descriptors[route.key];
      const { name } = route as BarRoute;
      const label =
        typeof options.tabBarLabel === "string"
          ? options.tabBarLabel
          : typeof options.title === "string"
            ? options.title
            : name;
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
