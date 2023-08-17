import unocss from "unocss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { themeScriptPlugin } from "@hiogawa/theme-script/dist/vite";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    unocss(),
    solid(),
    themeScriptPlugin({
      defaultTheme: "dark",
      storageKey: "argon2-wasm-bindgen:theme",
    }),
  ],
});
