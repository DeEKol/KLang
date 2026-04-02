import type { IGameResult } from "../../../modules/games/_shared/types";

export type { IGameResult };

export interface IGameResultSchema {
  lastResult: IGameResult | null;
  gameName: string | null;
}
