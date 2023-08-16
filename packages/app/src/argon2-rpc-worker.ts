import * as argon2 from "@hiogawa/argon2-wasm-bindgen";
import {
  exposeRpc,
  messagePortServerAdapter,
} from "@hiogawa/tiny-rpc/dist/index-v2";

export type Argon2 = typeof argon2;

function main() {
  exposeRpc({
    routes: argon2,
    adapter: messagePortServerAdapter({
      port: globalThis,
      onError(e) {
        console.error(e);
      },
    }),
  });
  console.log(argon2);
}

main();
