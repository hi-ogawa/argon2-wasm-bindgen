import { once } from "@hiogawa/utils";
import Argon2Worker from "./argon2-rpc-worker?worker";
import type { Argon2 } from "./argon2-rpc-worker";
import {
  proxyRpc,
  messagePortClientAdapter,
  RpcRoutesAsync,
} from "@hiogawa/tiny-rpc/dist/index-v2";

export let argon2: RpcRoutesAsync<Argon2>;

export const initializeArgon2 = once(async () => {
  const worker = new Argon2Worker();
  argon2 = proxyRpc<Argon2>({
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
