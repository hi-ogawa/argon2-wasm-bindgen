import { defineConfig } from "tsup";
import fs from "node:fs";
import process from "node:process";

// build in two steps so that 2nd step can use the 1st step's output

export default [
  defineConfig(() => [
    {
      entry: ["src-js/bundle.ts", "src-js/worker-web-main.ts"],
      format: ["esm"],
      dts: true,
      splitting: false,
      platform: "neutral",
      loader: {
        ".wasm": "binary",
      },
    },
    {
      entry: ["src-js/worker-node-main.ts"],
      format: ["esm"],
      dts: true,
      splitting: false,
      platform: "node",
      loader: {
        ".wasm": "binary",
      },
    },
  ]),
  defineConfig(() => [
    {
      entry: ["src-js/worker-web.ts"],
      format: ["esm"],
      dts: true,
      splitting: false,
      platform: "neutral",
      define: {
        DEFINE_WORKER_CODE: JSON.stringify(
          fs.readFileSync("./dist/worker-web-main.js", "utf-8")
        ),
      },
    },
    {
      entry: ["src-js/worker-node.ts"],
      format: ["esm", "cjs"],
      dts: true,
      splitting: false,
      platform: "node",
      define: {
        DEFINE_WORKER_CODE: JSON.stringify(
          fs.readFileSync("./dist/worker-node-main.js", "utf-8")
        ),
      },
    },
  ]),
][process.env["BUILD_STEP"]!];
