import React from "react";
import { NavigationProvider } from "app/providers/NavigationProvider";
import { StoreProvider } from "app/providers/StoreProvider";

import "react-native-gesture-handler";

function App(): React.JSX.Element {
  return (
    <StoreProvider>
      <NavigationProvider />
    </StoreProvider>
  );
}

export default App;
