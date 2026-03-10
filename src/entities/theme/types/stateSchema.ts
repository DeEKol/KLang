import type { IThemeSchema } from "entities/theme";
import type { PersistPartial } from "redux-persist/lib/persistReducer";

export interface IStateSchema {
  theme: IThemeSchema & PersistPartial;
}
