import * as argon2 from "./bundle";
import { parentPort } from "node:worker_threads";
import { tinyassert } from "@hiogawa/utils";
import {
  exposeRpc,
  messagePortServerAdapter,
} from "@hiogawa/tiny-rpc/dist/index-v2";

export type Argon2 = typeof argon2;

function main() {
  tinyassert(parentPort);
  const parent = parentPort;

  parent.once("message", (ev) => {
    tinyassert(ev.port instanceof MessagePort);
    exposeRpc({
      routes: argon2,
      adapter: messagePortServerAdapter({
        port: ev.port,
      }),
    });
    parent.postMessage(ev.id);
  });
}

main();
