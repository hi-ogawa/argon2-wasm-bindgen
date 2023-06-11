import initWasmBindGen from "../pkg/index";
export * from "../pkg/index";

export async function initializeBundle() {
  // TODO: it turns out esbuild's `binary` load relies on nodejs `Buffer.from(..., "base64")`
  // inline ~100KB binary of base64 (cf. tsup.config.ts)
  const imported = await import("../pkg/index_bg.wasm");
  const wasmSource = imported.default as unknown as Uint8Array;
  const wasmModule = await WebAssembly.compile(wasmSource);
  await initWasmBindGen(wasmModule);
}
