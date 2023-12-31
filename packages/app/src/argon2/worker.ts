import * as argon2 from "@hiogawa/argon2-wasm-bindgen";
import { exposeTinyRpc, messagePortServerAdapter } from "@hiogawa/tiny-rpc";

export type Argon2 = typeof argon2;

function main() {
  exposeTinyRpc({
    routes: argon2,
    adapter: messagePortServerAdapter({
      port: globalThis,
    }),
  });
}

main();
