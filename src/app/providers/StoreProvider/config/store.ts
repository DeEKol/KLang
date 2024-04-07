import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { counterReducer } from "entities/Counter/model/slice/counterSlice";
import { postsReducer } from "entities/PostsTestApi/model/slice/postsSlice";
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import { themeReducer } from "shared/lib/theme/model/slice/themeSlice";

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
