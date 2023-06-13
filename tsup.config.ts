import { defineConfig, Options } from "tsup";
import fs from "node:fs";
import process from "node:process";

export default [
  process.env["BUILD_STEP"] == "1" &&
    defineConfig({
      entry: ["src-js/bundle.ts", "src-js/comlink.ts"],
      format: ["esm", "cjs"],
      dts: true,
      platform: "neutral",
      loader: {
        ".wasm": "binary",
      },
    }),
  process.env["BUILD_STEP"] == "1" &&
    defineConfig({
      entry: ["src-js/comlink-node.ts"],
      format: ["esm", "cjs"],
      dts: true,
      platform: "node",
      loader: {
        ".wasm": "binary",
      },
    }),
  process.env["BUILD_STEP"] == "2" &&
    defineConfig({
      entry: ["src-js/comlink-node-proxy.ts"],
      format: ["esm", "cjs"],
      dts: true,
      platform: "node",
      define: {
        DEFINE_WORKER_CODE: JSON.stringify(
          fs.readFileSync("./dist/comlink-node.js", "utf-8")
        ),
      },
    }),
].filter(Boolean);
