import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "app/providers/AuthProvider";
import { InitProvider } from "app/providers/InitProvider";
import { NavigationProvider } from "app/providers/NavigationProvider";
import { StoreProvider } from "app/providers/StoreProvider";
import { ThemeInitializer, UIProvider } from "app/providers/UIProvider";

function App(): React.JSX.Element {
  // ? Render
  return (
    <StoreProvider>
      <InitProvider>
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
      </InitProvider>
    </StoreProvider>
  );
}

export default App;
