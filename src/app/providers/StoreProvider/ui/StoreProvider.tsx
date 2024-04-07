import React from "react";
import { Provider, useDispatch } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { createReduxStore } from "../config/store";

type TStoreProviderProps = {
  children: string | JSX.Element | JSX.Element[];
};
const store = createReduxStore();

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => {
  return useDispatch<AppDispatch>();
};

export const StoreProvider = ({ children }: TStoreProviderProps) => {
  const persistor = persistStore(store);

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
