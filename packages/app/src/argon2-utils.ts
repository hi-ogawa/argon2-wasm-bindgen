import WASM_URL from "@hiogawa/argon2-wasm-bindgen/pkg/index_bg.wasm?url";
import initArgon2 from "@hiogawa/argon2-wasm-bindgen";
import * as argon2 from "@hiogawa/argon2-wasm-bindgen";
import { once } from "@hiogawa/utils";

// TODO: run in background thread (web worker) to avoid blocking UI.

export { argon2 };

export const initializeArgon2 = once(() => initArgon2(WASM_URL));

export function encodeSalt(salt: string) {
  // base64 without "=" padding
  return btoa(salt).replaceAll("=", "");
}
