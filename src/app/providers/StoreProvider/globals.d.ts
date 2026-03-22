// Ambient global declarations for Redux store types.
// FSD exception: allows shared/ and entities/ layers to use RootState / AppDispatch
// without importing from app/. Only type-level — zero runtime impact.
// Source of truth: StoreProvider.tsx (types derived from the store instance).
import type { AppDispatch as _AppDispatch, RootState as _RootState } from "./StoreProvider";

// export {} makes this a module so declare global augments the global scope correctly.
export {};

declare global {
  type RootState = _RootState;
  type AppDispatch = _AppDispatch;
}
