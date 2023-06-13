import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src-js/bundle.ts"],
  format: ["esm", "cjs"],
  platform: "neutral",
  loader: {
    ".wasm": "binary",
  },
  dts: true,
});
