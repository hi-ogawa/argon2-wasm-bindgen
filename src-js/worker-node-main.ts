import * as argon2 from "./bundle";
import { parentPort } from "node:worker_threads";
import { tinyassert } from "@hiogawa/utils";
import {
  exposeTinyRpc,
  messagePortServerAdapter,
  messagePortNodeCompat,
} from "@hiogawa/tiny-rpc";

export type Argon2 = typeof argon2;

function main() {
  tinyassert(parentPort);
  exposeTinyRpc({
    routes: argon2,
    adapter: messagePortServerAdapter({
      port: messagePortNodeCompat(parentPort),
    }),
  });
}

main();
