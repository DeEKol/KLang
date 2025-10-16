import type { PersistPartial } from "redux-persist/lib/persistReducer";
import type { IThemeSchema } from "shared/lib/theme";

export interface IStateSchema {
  theme: IThemeSchema & PersistPartial;
}
