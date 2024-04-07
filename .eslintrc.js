module.exports = {
  env: {
    es2021: true,
    node: true,
    "react-native/react-native": true,
  },
  extends: [
    "prettier",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:i18next/recommended",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "import",
    "react",
    "prettier",
    "react-native",
    "simple-import-sort",
    "@typescript-eslint",
    "i18next",
  ],
  rules: {
    //? START - prettier settings ?//
    "prettier/prettier": "error",
    //! END - prettier settings ?//

    //? START - rules setting
    //? START - RULES DEFAULT
    "no-console": ["warn", { allow: ["error"] }],
    "no-restricted-imports": [
      "error",
      {
        patterns: ["*.tsx"],
      },
    ],
    //! END - RULES DEFAULT

    //! START - RULES REACT
    "react-native/no-unused-styles": "error",
    "react-native/no-inline-styles": "error",
    "react-native/no-color-literals": "warn",
    "react-native/no-single-element-style-arrays": "error",
    "react-hooks/rules-of-hooks": "off",
    "react-hooks/exhaustive-deps": "off",
    "react/no-array-index-key": "error",
    "react/react-in-jsx-scope": "error",
    "react/self-closing-comp": ["error", { component: true }],
    //! END - RULES REACT

    //! START - RULES TYPESCRIPT
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
      },
    ],
    //! END - RULES TYPESCRIPT
    //! END - rules setting

    //? START - import setting ?//
    "import/first": "error",
    "import/no-duplicates": "error",
    "import/newline-after-import": "error",
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // Packages `react` related packages come first.
          ["^react", "^@?\\w"],
          // other import (npm).
          ["^\\u0000"],
          //@app
          ["^@app?\\w"],
          //@app/components
          ["^@app/components?\\w"],
          // Parent imports. Put `..` last.
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          // Other relative imports. Put same-folder imports and `.` last.
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
        ],
      },
    ],
    "sort-imports": [
      "error",
      {
        ignoreCase: false,
        ignoreMemberSort: true,
        memberSyntaxSortOrder: ["none", "all", "single", "multiple"],
        ignoreDeclarationSort: true,
        allowSeparatedGroups: true,
      },
    ],
    //! END - eslint-plugin-simple-import-sort ?//

    //! START - RULES i18next
    "i18next/no-literal-string": [
      "error",
      { markupOnly: true, ignoreAttribute: ["to", "data-testid"] },
    ],
    //! END - RULES i18next
  },
};
