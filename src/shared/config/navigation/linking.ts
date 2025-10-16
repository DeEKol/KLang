import type { LinkingOptions } from "@react-navigation/native";

import type { TRootStackParamList } from "./types/navigation";

export const linking: LinkingOptions<TRootStackParamList> = {
  prefixes: ["klang://"], // TODO add external links ("https://example.com", "https://www.example.com")
  config: {
    screens: {
      Auth: {
        screens: {
          Login: "login",
          Signup: "signup",
        },
      },
      Main: {
        screens: {
          HomeScreen: "home",
          Study: "study",
          PracticeScreen: "practice",
          SettingsScreen: "settings",
          TestScreen: "test",
        },
      },
      Modal: "modal/:screen?",
      NotFound: "*",
    },
  },
};
