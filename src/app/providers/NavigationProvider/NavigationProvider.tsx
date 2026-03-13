// ? Library Imports
import React, { useEffect, useState } from "react";
import { Linking } from "react-native";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// ? Slice Imports
import {
  clearPendingLink,
  getIsAuthenticated,
  getIsInitialized,
  getPendingLink,
  setPendingLink,
} from "entities/auth";
import { ModalScreen } from "screens/ModalScreen";
import { NotFoundScreen } from "screens/NotFoundScreen";
import { SplashScreen } from "screens/SplashScreen";
// ? Types
import { ENavigation, type TRootStackParamList } from "shared/config/navigation";
import { linking, navigationRef, resetTo } from "shared/config/navigation";

import { useAppDispatch } from "../StoreProvider";

// ? Layer Imports
import { AuthStackNavigator } from "./stacks/AuthStackNavigator";
import { BottomTabsNavigator } from "./BottomTabsNavigator";
import { useNavigationTheme } from "./useNavigationTheme";
// ? Components
const RootStack = createNativeStackNavigator<TRootStackParamList>();

/*
 * Компонент, провайдер навигации
 */
export const NavigationProvider: React.FC = () => {
  // ? Redux
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector(getIsAuthenticated);
  const isInitialized = useSelector(getIsInitialized);
  const pendingLink = useSelector(getPendingLink);

  // ? Splash: показываем пока анимация не завершена И Firebase не инициализирован.
  // В dev-режиме сплэш скипается для быстрой итерации.
  const [animationDone, setAnimationDone] = useState(__DEV__);
  const showSplash = !__DEV__ && (!isInitialized || !animationDone);

  // ? Theme
  const { theme: navTheme } = useNavigationTheme();

  // ? Lifecycle
  // * Обрабатываем incoming URLs и сохраняем pendingLink если неавторизован
  useEffect(() => {
    const handleUrl = (event: { url: string }) => {
      const url = event.url;

      if (!isAuthenticated) {
        dispatch(setPendingLink(url));
      }
      // * если авторизован — NavigationContainer + linking сам обработают переход
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleUrl({ url });
    });

    const sub = Linking.addEventListener("url", handleUrl);

    return () => sub.remove();
  }, [isAuthenticated, dispatch]);

  // * если пользователь только что залогинился — пробуем выполнить pendingLink
  useEffect(() => {
    if (isAuthenticated && pendingLink) {
      resetTo(ENavigation.MAIN);

      Linking.openURL(pendingLink);

      dispatch(clearPendingLink());
    }
  }, [isAuthenticated, pendingLink, dispatch]);

  // ? Render
  if (showSplash) {
    return (
      <SplashScreen
        onAnimationComplete={() => setAnimationDone(true)}
        isLoading={!isInitialized}
      />
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      theme={navTheme}
      fallback={<></>}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <RootStack.Screen
            name={ENavigation.AUTH}
            component={AuthStackNavigator}
          />
        ) : (
          <>
            <RootStack.Screen
              name={ENavigation.MAIN}
              component={BottomTabsNavigator}
            />
            <RootStack.Screen
              name={ENavigation.MODAL}
              component={ModalScreen}
              options={{ presentation: "modal" }}
            />
            <RootStack.Screen
              name={ENavigation.NOT_FOUND}
              component={NotFoundScreen}
              options={{ title: "Oops!" }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
