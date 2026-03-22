import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

// RootState and AppDispatch are declared globally in app/providers/StoreProvider/globals.d.ts
// FSD exception: avoids shared → app cross-layer import. Zero runtime impact (type-only).
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
