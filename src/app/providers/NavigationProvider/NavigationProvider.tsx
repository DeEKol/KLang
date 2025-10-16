// ? Library Imports
import React, { useEffect } from "react";
import { Linking } from "react-native";
import { useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// ? Slice Imports
import { clearPendingLink, getIsAuthenticated, setPendingLink } from "entities/auth";
import { ModalScreen } from "screens/ModalScreen";
import { NotFoundScreen } from "screens/NotFoundScreen";
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
  const pendingLink = useSelector(
    (state: { auth: { pendingLink: string | null } }) => state.auth.pendingLink,
  );

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
