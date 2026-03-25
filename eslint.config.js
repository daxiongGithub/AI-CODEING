const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = defineConfig([
  ...expoConfig,
  prettierConfig,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "warn",
    },
  },
  {
    ignores: [
      "node_modules/",
      ".expo/",
      "dist/",
      "ios/",
      "android/",
      "db/migrations/",
      ".ai/",
      "docs/",
      ".vscode/",
    ],
  },
]);
