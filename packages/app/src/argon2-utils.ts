import { once } from "@hiogawa/utils";
import { Argon2Service } from "./argon2-worker";
import { Remote, wrap } from "comlink";

export let argon2: Remote<Argon2Service>;

export const initializeArgon2 = once(async () => {
  const worker = new Worker(new URL("./argon2-worker.ts", import.meta.url), {
    type: "module",
  });
  argon2 = wrap<Argon2Service>(worker);
  await argon2.initialize();
});

export function encodeSalt(salt: string) {
  // base64 without "=" padding
  return btoa(salt).replaceAll("=", "");
}
