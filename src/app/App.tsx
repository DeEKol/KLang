import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "app/providers/AuthProvider";
import { NavigationProvider } from "app/providers/NavigationProvider";
import { StoreProvider } from "app/providers/StoreProvider";
import { ThemeInitializer, UIProvider } from "app/providers/UIProvider";

function App(): React.JSX.Element {
  // ? Render
  return (
    <StoreProvider>
      <SafeAreaProvider>
        <UIProvider>
          <AuthProvider>
            <ThemeInitializer />
            <GestureHandlerRootView>
              <NavigationProvider />
            </GestureHandlerRootView>
          </AuthProvider>
        </UIProvider>
      </SafeAreaProvider>
    </StoreProvider>
  );
}

export default App;
