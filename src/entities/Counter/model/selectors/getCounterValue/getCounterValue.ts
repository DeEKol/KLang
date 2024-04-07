import { createSelector } from "@reduxjs/toolkit";

import type { ICounterSchema } from "../../../types/counterSchema";
import { getCounter } from "../getCounter/getCounter";

export const getCounterValue = createSelector(
  getCounter,
  (counter: ICounterSchema) => counter.value,
);
