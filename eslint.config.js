const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier");

module.exports = defineConfig([
  ...expoConfig,
  prettierConfig,
  {
    rules: {
      // clsx v1 只有默认导出，ESLint 误判为具名导出同名冲突
      "import/no-named-as-default": "off",
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
