import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import prettierPlugin from "eslint-plugin-prettier"
import prettierConfig from "eslint-config-prettier"
import { defineConfig, globalIgnores } from "eslint/config"

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite
    ],
    plugins: {
      prettier: prettierPlugin
    },
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      "prettier/prettier": "warn",

      // === Logic & Best Practices ===
      "no-useless-catch": "off", // Tắt cảnh báo khối catch vô nghĩa
      "no-console": ["warn", { allow: ["info", "warn", "error"] }],

      // === TypeScript Specific ===
      "@typescript-eslint/no-explicit-any": "warn", // Cảnh báo khi sử dụng kiểu any
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],

      // ===== Naming conventions =====
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "interface",
          format: ["PascalCase"],
          custom: { regex: "^I[A-Z]", match: false } // Không dùng tiền tố 'I'
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"]
        },
        {
          selector: "enum",
          format: ["PascalCase"]
        },
        {
          selector: "enumMember",
          format: ["UPPER_CASE"]
        },
        {
          selector: "variable",
          modifiers: ["const", "global"],
          format: ["camelCase", "UPPER_CASE", "PascalCase"]
        }
      ],

      // ===== Misc =====
      "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],

      // React
      "react-refresh/only-export-components": "off"
    }
  },
  prettierConfig
])
