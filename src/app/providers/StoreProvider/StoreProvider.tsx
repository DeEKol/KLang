import React from "react";
import type { TypedUseSelectorHook } from "react-redux";
import { Provider, useDispatch, useSelector } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { createReduxStore } from "./config/store";

type TStoreProviderProps = {
  children: string | React.ReactElement | React.ReactElement[];
};

const store = createReduxStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => {
  return useDispatch<AppDispatch>();
};
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const StoreProvider = ({ children }: TStoreProviderProps) => {
  const persistor = persistStore(store);

  // ? Render
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
