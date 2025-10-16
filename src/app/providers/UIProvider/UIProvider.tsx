import React, { useMemo } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { mapTokensToMD3 } from "shared/lib/theme/mapTokensToMD3";
import { useThemeTokens } from "shared/lib/theme/useThemeTokens";

type TUIProviderProps = { children?: React.ReactNode };

export const UIProvider: React.FC<TUIProviderProps> = ({ children }) => {
  // ? Hooks
  const tokens = useThemeTokens();

  // ? Derived state
  const md3 = useMemo(() => mapTokensToMD3(tokens), [tokens]);

  // ? Render
  return <PaperProvider theme={md3}>{children}</PaperProvider>;
};
