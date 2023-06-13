import { once } from "@hiogawa/utils";
import { Remote, wrap } from "comlink";
import { Argon2 } from "@hiogawa/argon2-wasm-bindgen/dist/comlink";

export let argon2: Remote<Argon2>;

export const initializeArgon2 = once(async () => {
  const worker = new Worker(
    new URL("@hiogawa/argon2-wasm-bindgen/dist/comlink", import.meta.url),
    {
      type: "module",
    }
  );
  argon2 = wrap(worker);
  await argon2.initBundle();
});

export function encodeSalt(salt: string) {
  // base64 without "=" padding
  return btoa(salt).replaceAll("=", "");
}
