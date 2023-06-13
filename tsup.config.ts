import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src-js/index-tsup.ts", "src-js/wasm-base64.ts"],
  format: ["esm", "cjs"],
  dts: true,
  esbuildOptions(options, _context) {
    const loader = (options.loader ??= {});
    loader[".wasm"] = "base64";
  },
});
