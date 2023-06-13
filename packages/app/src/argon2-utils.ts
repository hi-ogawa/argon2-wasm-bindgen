import { once } from "@hiogawa/utils";
import { initWorker } from "@hiogawa/argon2-wasm-bindgen/dist/worker-web";

export let worker: Awaited<ReturnType<typeof initWorker>>;
export let argon2: (typeof worker)["argon2"];

export const initializeArgon2 = once(async () => {
  worker = await initWorker();
  argon2 = worker.argon2;
  await argon2.initBundle();
});

export function encodeSalt(salt: string) {
  // base64 without "=" padding
  return btoa(salt).replaceAll("=", "");
}
