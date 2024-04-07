import type { ICounterSchema } from "entities/Counter/types/counterSchema";
import type { IPostsSchema } from "entities/PostsTestApi/types/postsSchema";
import type { PersistPartial } from "redux-persist/lib/persistReducer";
import type { IThemeSchema } from "shared/lib/theme/types/themeSchema";

export interface IStateSchema {
  counter: ICounterSchema;
  theme: IThemeSchema & PersistPartial;
  posts: IPostsSchema;
}
