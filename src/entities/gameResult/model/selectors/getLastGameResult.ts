import type { IStateSchema } from "app/providers/StoreProvider";

export const getLastGameResult = (state: IStateSchema) => state.gameResult.lastResult;
export const getLastGameName = (state: IStateSchema) => state.gameResult.gameName;
