import initWasmBindGen from "../pkg/index";
import wasmSource from "../pkg/index_bg.wasm"; // relies on esbuild's binary loader

// initialize with bundled wasm binary as base64 string (~100KB) so that it's easier for downstream to consume
export async function initBundle() {
  const wasmModule = await WebAssembly.compile(wasmSource as any as Uint8Array);
  await initWasmBindGen(wasmModule);
}

// re-export everything
export { default } from "../pkg/index";
export * from "../pkg/index";
