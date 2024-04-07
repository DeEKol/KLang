import type { PersistPartial } from "redux-persist/lib/persistReducer";
import type { IThemeSchema } from "shared/lib/theme/types/themeSchema";

export interface IStateSchema {
  theme: IThemeSchema & PersistPartial;
}
