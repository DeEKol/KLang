import type { ICounterSchema } from "entities/Counter";
import type { IPostsSchema } from "entities/PostsTestApi";
import type { PersistPartial } from "redux-persist/lib/persistReducer";
import type { IThemeSchema } from "shared/lib/theme";

export interface IStateSchema {
  counter: ICounterSchema;
  theme: IThemeSchema & PersistPartial;
  posts: IPostsSchema;
}
