import * as argon2 from "./bundle";
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
