import initWasmBindGen from "../pkg/index";
import WASM_BASE64 from "./wasm-base64";

export * from "../pkg/index";

export async function initializeNode() {
  const wasmSource = new Uint8Array(Buffer.from(WASM_BASE64, "base64"));
  const wasmModule = await WebAssembly.compile(wasmSource);
  await initWasmBindGen(wasmModule);
}
