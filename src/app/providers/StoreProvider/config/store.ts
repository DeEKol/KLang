import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "entities/auth";
import { counterReducer } from "entities/Counter";
import { postsReducer } from "entities/PostsTestApi";
import { themeReducer } from "entities/theme";
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from "redux-persist";

import type { IStateSchema } from "../types/stateSchema";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const themePersistedReducer = persistReducer(persistConfig, themeReducer);

const rootReducers = combineReducers({
  counter: counterReducer,
  theme: themePersistedReducer,
  posts: postsReducer,
  auth: authReducer,
});

export function createReduxStore(initialState?: IStateSchema) {
  return configureStore<IStateSchema>({
    reducer: rootReducers,
    devTools: __DEV__,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
}
