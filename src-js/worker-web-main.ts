import * as argon2 from "./bundle";
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
    }),
  });
}

main();
