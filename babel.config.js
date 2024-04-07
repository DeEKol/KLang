module.exports = {
  presets: ["module:@react-native/babel-preset"],
  // presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ["module:react-native-dotenv"],
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          app: "./src/app",
          entities: "./src/entities",
          features: "./src/features",
          screens: "./src/screens",
          shared: "./src/shared",
          widgets: "./src/widgets",
        },
      },
    ],
  ],
};
