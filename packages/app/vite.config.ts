import unocss from "unocss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { themeScriptPlugin } from "@hiogawa/theme-script/dist/vite";
import vitePluginWasm from "vite-plugin-wasm"

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    vitePluginWasm(),
    unocss(),
    solid(),
    themeScriptPlugin({
      defaultTheme: "dark",
      storageKey: "argon2-wasm-bindgen:theme",
    }),
  ],
});
