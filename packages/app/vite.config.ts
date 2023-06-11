import unocss from "unocss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import fs from "node:fs";

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [unocss(), solid(), injectThemeScriptPlugin()],
});

function injectThemeScriptPlugin() {
  const script = fs.readFileSync(
    require.resolve("@hiogawa/utils-experimental/dist/theme-script.global.js"),
    "utf-8"
  );
  return {
    name: "local:" + injectThemeScriptPlugin.name,
    transformIndexHtml(html: string) {
      return html.replace(
        /<!--@@INJECT_THEME_SCRIPT@@-->/,
        `\
<script>
  globalThis.__themeStorageKey = "argon2-wasm-bindgen:theme";
  ${script}
</script>`
      );
    },
  };
}
