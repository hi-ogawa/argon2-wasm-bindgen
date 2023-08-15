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

  parentPort.once("message", (ev: unknown) => {
    tinyassert(
      ev &&
        typeof ev === "object" &&
        "port" in ev &&
        ev.port instanceof MessagePort
    );

    exposeRpc({
      routes: argon2,
      adapter: messagePortServerAdapter({
        port: ev.port,
      }),
    });
  });
}

main();
