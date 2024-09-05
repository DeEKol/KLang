import type { IStateSchema } from "app/providers/StoreProvider";

export const getCounter = (state: IStateSchema) => state.posts;
