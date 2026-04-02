import type { ICounterSchema } from "../../../types/counterSchema";

type TStateWithCounter = {
  counter: ICounterSchema;
};

export const getCounter = (state: TStateWithCounter) => state.counter;
