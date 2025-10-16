/**
 * @format
 */

import { AppRegistry } from "react-native";

import "./src/shared/config/i18n/i18n";

import App from "./src/app/App";
import { name as appName } from "./app.json";

async function testNetwork() {
  try {
    const res = await fetch("https://www.google.com");
    console.log("fetch ok", res.status);
  } catch (e) {
    console.error("fetch failed", e);
  }
}

// testNetwork();

AppRegistry.registerComponent(appName, () => App);
