import type { LinkingOptions } from "@react-navigation/native";

import { ENavigation, type TRootStackParamList } from "./types/navigation";
import { ETabNavigation } from "./types/tab-navigation";
import { ROUTE_PATHS } from "./routes";

export const linking: LinkingOptions<TRootStackParamList> = {
  prefixes: ["klang://"], // TODO add external links ("https://example.com", "https://www.example.com")
  config: {
    screens: {
      [ENavigation.AUTH]: {
        screens: {
          [ENavigation.LOGIN]: ROUTE_PATHS[ENavigation.LOGIN],
          [ENavigation.SIGNUP]: ROUTE_PATHS[ENavigation.SIGNUP],
          [ENavigation.FORGOT_PASSWORD]: ROUTE_PATHS[ENavigation.FORGOT_PASSWORD],
          [ENavigation.EMAIL_CONFIRMATION]: ROUTE_PATHS[ENavigation.EMAIL_CONFIRMATION],
          [ENavigation.SMS_CONFIRMATION]: ROUTE_PATHS[ENavigation.SMS_CONFIRMATION],
        },
      },
      [ENavigation.MAIN]: {
        screens: {
          [ETabNavigation.HOME]: {
            screens: {
              [ENavigation.HOME]: ROUTE_PATHS[ENavigation.HOME],
              [ENavigation.PROFILE]: ROUTE_PATHS[ENavigation.PROFILE],
              [ENavigation.ROADMAP]: ROUTE_PATHS[ENavigation.ROADMAP],
            },
          },
          [ETabNavigation.STUDY]: {
            screens: {
              [ENavigation.STUDY]: ROUTE_PATHS[ENavigation.STUDY],
              [ENavigation.LESSON]: ROUTE_PATHS[ENavigation.LESSON],
            },
          },
          [ETabNavigation.PRACTICE]: {
            screens: {
              [ENavigation.PRACTICE]: ROUTE_PATHS[ENavigation.PRACTICE],
              [ENavigation.HANGEL]: ROUTE_PATHS[ENavigation.HANGEL],
              [ENavigation.WORD_MATCHER]: ROUTE_PATHS[ENavigation.WORD_MATCHER],
              [ENavigation.SEQUENCES_BUILDER]: ROUTE_PATHS[ENavigation.SEQUENCES_BUILDER],
            },
          },
          [ETabNavigation.SETTINGS]: {
            screens: {
              [ENavigation.SETTINGS]: ROUTE_PATHS[ENavigation.SETTINGS],
            },
          },
          [ETabNavigation.TEST]: {
            screens: {
              [ENavigation.TEST]: ROUTE_PATHS[ENavigation.TEST],
              [ENavigation.UI_SCREEN]: ROUTE_PATHS[ENavigation.UI_SCREEN],
            },
          },
        },
      },
      [ENavigation.MODAL]: ROUTE_PATHS[ENavigation.MODAL],
      [ENavigation.NOT_FOUND]: ROUTE_PATHS[ENavigation.NOT_FOUND],
    },
  },
};
