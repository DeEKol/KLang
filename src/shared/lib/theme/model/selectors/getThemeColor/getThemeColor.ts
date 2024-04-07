import { createSelector } from "@reduxjs/toolkit";
import { getTheme } from "shared/lib/theme/model/selectors/getTheme/getTheme";
import type { IThemeSchema } from "shared/lib/theme/types/themeSchema";

export const getThemeColor = createSelector(getTheme, (theme: IThemeSchema) => theme.color);
