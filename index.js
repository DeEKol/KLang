/**
 * @format
 */

import { AppRegistry } from "react-native";

import "./src/shared/config/i18n/i18n";

import App from "./src/app/App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
