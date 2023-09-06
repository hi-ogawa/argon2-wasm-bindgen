import { once } from "@hiogawa/utils";
import Argon2Worker from "./worker?worker";
import type { Argon2 } from "./worker";
import {
  proxyTinyRpc,
  messagePortClientAdapter,
  TinyRpcProxy,
} from "@hiogawa/tiny-rpc";

export let argon2: TinyRpcProxy<Argon2>;

export const initializeArgon2 = once(async () => {
  const worker = new Argon2Worker();
  argon2 = proxyTinyRpc<Argon2>({
    adapter: messagePortClientAdapter({
      port: worker,
    }),
  });
  await argon2.initBundle();
});

export function encodeSalt(salt: string) {
  // base64 without "=" padding
  return btoa(salt).replaceAll("=", "");
}
