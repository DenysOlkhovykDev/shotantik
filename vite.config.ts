import { defineConfig } from "vite";
import path from "path";

export default defineConfig(({ mode }) => ({
  base: mode === "gh-pages" ? "/shotantik/" : mode === "itch" ? "./" : "/",

  resolve: {
    alias: {
      "@aircraft": path.resolve(__dirname, "src/aircraft"),
      "@background": path.resolve(__dirname, "src/background"),
      "@moving": path.resolve(__dirname, "src/moving"),
      "@dashboard": path.resolve(__dirname, "src/dashboard"),
      "@islands": path.resolve(__dirname, "src/islands"),
      "@on-ground": path.resolve(__dirname, "src/on-ground"),
      "@resources": path.resolve(__dirname, "src/resources"),
      "@camera": path.resolve(__dirname, "src/ui/camera"),
      "@compass": path.resolve(__dirname, "src/ui/compass"),
      "@construction": path.resolve(__dirname, "src/ui/construction"),
      "@header": path.resolve(__dirname, "src/ui/header"),
      "@joystick": path.resolve(__dirname, "src/ui/joystick"),
      "@pause": path.resolve(__dirname, "src/ui/pause"),
      "@speed": path.resolve(__dirname, "src/ui/speed"),
      "@research": path.resolve(__dirname, "src/ui/research"),
      "@tutorial": path.resolve(__dirname, "src/ui/tutorial"),
      "@roads": path.resolve(__dirname, "src/roads"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@workers": path.resolve(__dirname, "src/workers"),
      "@test-situations": path.resolve(__dirname, "src/test-situations"),
      "@test-scenarios": path.resolve(__dirname, "tests/scenarios"),
    },
  },
}));
