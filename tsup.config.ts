import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src-js/index-wasm-bundle.ts"],
  format: ["esm", "cjs"],
  dts: true,
  esbuildOptions(options, _context) {
    const loader = (options.loader ??= {});
    loader[".wasm"] = "binary";
  },
});
