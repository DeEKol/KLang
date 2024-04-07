/**
 * @format
 */

import { AppRegistry } from "react-native";

import "./shared/config/i18n/i18n";

import { name as appName } from "../app.json";

import App from "./app/App";

AppRegistry.registerComponent(appName, () => App);
