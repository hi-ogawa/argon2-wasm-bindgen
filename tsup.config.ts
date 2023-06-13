import { defineConfig } from "tsup";
import fs from "node:fs";
import process from "node:process";

// build in two steps so that 2nd step can use the 1st step's output

export default [
  process.env["BUILD_STEP"] == "1" &&
    defineConfig([
      {
        entry: ["src-js/bundle.ts", "src-js/comlink-web.ts"],
        format: ["esm", "cjs"],
        dts: true,
        splitting: false,
        platform: "neutral",
        loader: {
          ".wasm": "binary",
        },
      },
      {
        entry: ["src-js/comlink-node.ts"],
        format: ["esm", "cjs"],
        dts: true,
        splitting: false,
        platform: "node",
        loader: {
          ".wasm": "binary",
        },
      },
    ]),
  process.env["BUILD_STEP"] == "2" &&
    defineConfig([
      {
        entry: ["src-js/comlink-web-proxy.ts"],
        format: ["esm", "cjs"],
        dts: true,
        splitting: false,
        platform: "neutral",
        define: {
          DEFINE_WORKER_CODE: JSON.stringify(
            fs.readFileSync("./dist/comlink-web.js", "utf-8")
          ),
        },
      },
      {
        entry: ["src-js/comlink-node-proxy.ts"],
        format: ["esm", "cjs"],
        dts: true,
        splitting: false,
        platform: "node",
        define: {
          DEFINE_WORKER_CODE: JSON.stringify(
            fs.readFileSync("./dist/comlink-node.js", "utf-8")
          ),
        },
      },
    ]),
]
  .filter(Boolean)
  .flat();
