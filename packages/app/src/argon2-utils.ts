import { once } from "@hiogawa/utils";
import { initComlinkProxy } from "@hiogawa/argon2-wasm-bindgen/dist/comlink-web-proxy";

export let proxy: Awaited<ReturnType<typeof initComlinkProxy>>;
export let argon2: (typeof proxy)["argon2"];

export const initializeArgon2 = once(async () => {
  proxy = await initComlinkProxy();
  argon2 = proxy.argon2;
  await argon2.initBundle();
});

export function encodeSalt(salt: string) {
  // base64 without "=" padding
  return btoa(salt).replaceAll("=", "");
}
