import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationProvider } from "app/providers/NavigationProvider";
import { StoreProvider } from "app/providers/StoreProvider";

function App(): React.JSX.Element {
  return (
    <StoreProvider>
      <GestureHandlerRootView>
        <NavigationProvider />
      </GestureHandlerRootView>
    </StoreProvider>
  );
}

export default App;
