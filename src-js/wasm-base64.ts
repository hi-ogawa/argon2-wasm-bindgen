// expose wasm binary as base64 string (~100KB) so that it's easier to bundle for downstream
import data from "../pkg/index_bg.wasm";
export const WASM_BASE64 = data as unknown as string;
