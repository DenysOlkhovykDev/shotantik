import { defineConfig } from "vite";
import path from "path";

export default defineConfig(({ mode }) => ({
  base: mode === "gh-pages" ? "/shotantik/" : mode === "itch" ? "./" : "/",

  resolve: {
    alias: {
      //Player
      "@aircraft": path.resolve(__dirname, "src/player/aircraft"),
      "@tasks": path.resolve(__dirname, "src/player/tasks"),
      "@moving": path.resolve(__dirname, "src/player/moving"),
      "@resources": path.resolve(__dirname, "src/player/resources"),
      "@roads": path.resolve(__dirname, "src/player/roads"),
      "@workers": path.resolve(__dirname, "src/player/workers"),
      //Ui
      "@camera": path.resolve(__dirname, "src/ui/camera"),
      "@compass": path.resolve(__dirname, "src/ui/compass"),
      "@construction": path.resolve(__dirname, "src/ui/construction"),
      "@header": path.resolve(__dirname, "src/ui/header"),
      "@joystick": path.resolve(__dirname, "src/ui/joystick"),
      "@pause": path.resolve(__dirname, "src/ui/pause"),
      "@speed": path.resolve(__dirname, "src/ui/speed"),
      "@research": path.resolve(__dirname, "src/ui/research"),
      "@tutorial": path.resolve(__dirname, "src/ui/tutorial"),
      //World
      "@background": path.resolve(__dirname, "src/world/background"),
      "@islands": path.resolve(__dirname, "src/world/islands"),
      "@objects": path.resolve(__dirname, "src/world/objects"),
      //Other
      "@utils": path.resolve(__dirname, "src/utils"),
      "@test-situations": path.resolve(__dirname, "src/test-situations"),
      "@test-scenarios": path.resolve(__dirname, "tests/scenarios"),
      "@test-infra": path.resolve(__dirname, "tests/test-infra"),
    },
  },
}));
