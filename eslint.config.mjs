import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/**"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-inferrable-types": "error",
      "@typescript-eslint/no-explicit-any": "error",

      "no-console": "warn",
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-var": "error",
      "no-unreachable": "error",

      "prefer-const": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "multi-line"],

      // TypeScript
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-non-null-assertion": "error",

      // JavaScript
      "no-unreachable-loop": "error",
      "no-self-assign": "error",
      "no-self-compare": "error",
      "no-constant-condition": "error",

      // Code
      "no-shadow": "error",
      "no-lonely-if": "error",
      "no-useless-return": "error",
      "no-useless-concat": "error",
      "no-useless-rename": "error",
    },
  },
);
