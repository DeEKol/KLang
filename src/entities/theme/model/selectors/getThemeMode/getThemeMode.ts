import { createSelector } from "@reduxjs/toolkit";

import type { IThemeSchema } from "../../../types/themeSchema";
import { getTheme } from "../getTheme/getTheme";

export const getThemeMode = createSelector(getTheme, (theme: IThemeSchema) => theme.mode);
