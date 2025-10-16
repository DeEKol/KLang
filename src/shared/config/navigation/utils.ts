import { CommonActions, createNavigationContainerRef } from "@react-navigation/native";

import type { TAllStackParamList, TRootStackParamList } from "./types/navigation";

export const navigationRef = createNavigationContainerRef<TRootStackParamList>();

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.goBack());
  }
}

export function navigate<RouteName extends keyof TAllStackParamList>(
  name: RouteName,
  params?: TAllStackParamList[RouteName],
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.navigate({
        // приведение к string безопасно — ключи TRootStackParamList сопоставимы со string
        name: name as unknown as string,
        params: params as unknown as object | undefined,
      }),
    );
  }
}

export function resetTo(name: keyof TAllStackParamList) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name }],
      }),
    );
  }
}
