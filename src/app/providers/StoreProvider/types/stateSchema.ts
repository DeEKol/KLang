import type { IAuthSchema } from "entities/auth";
import type { ICounterSchema } from "entities/Counter";
import type { IGameResultSchema } from "entities/gameResult";
import type { IPostsSchema } from "entities/PostsTestApi";
import type { IThemeSchema } from "entities/theme";
import type { IVocabularySchema } from "entities/vocabulary";
import type { PersistPartial } from "redux-persist/lib/persistReducer";

export interface IStateSchema {
  auth: IAuthSchema;
  counter: ICounterSchema;
  theme: IThemeSchema & PersistPartial;
  posts: IPostsSchema;
  gameResult: IGameResultSchema;
  vocabulary: IVocabularySchema;
}
