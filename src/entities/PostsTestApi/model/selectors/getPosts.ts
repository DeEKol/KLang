import type { IStateSchema } from "entities";

export const getCounter = (state: IStateSchema) => state.posts;
