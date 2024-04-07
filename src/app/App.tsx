import React from "react";
import { NavigationProvider } from "app/providers/NavigationProvider";
import { StoreProvider } from "app/providers/StoreProvider";

function App(): React.JSX.Element {
  return (
    <StoreProvider>
      <NavigationProvider />
    </StoreProvider>
  );
}

export default App;
