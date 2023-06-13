import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src-js/bundle.ts", "src-js/comlink.ts"],
    format: ["esm", "cjs"],
    platform: "neutral",
    loader: {
      ".wasm": "binary",
    },
    dts: true,
  },
  {
    entry: ["src-js/comlink-node.ts"],
    format: ["esm", "cjs"],
    platform: "node",
    loader: {
      ".wasm": "binary",
    },
    dts: true,
  },
]);
