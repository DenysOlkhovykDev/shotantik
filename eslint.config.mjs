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
    },
  },
);
