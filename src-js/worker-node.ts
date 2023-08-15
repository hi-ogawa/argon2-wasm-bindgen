import { Worker } from "node:worker_threads";
import { Argon2 } from "./worker-node-main";
import {
  proxyRpc,
  messagePortClientAdapter,
  messagePortNodeCompat,
} from "@hiogawa/tiny-rpc/dist/index-v2";

declare let DEFINE_WORKER_CODE: string;

export async function initWorker() {
  const url = new URL(
    `data:text/javascript,${encodeURIComponent(DEFINE_WORKER_CODE)}`
  );
  const worker = new Worker(url);
  const argon2 = proxyRpc<Argon2>({
    adapter: messagePortClientAdapter({ port: messagePortNodeCompat(worker) }),
  });
  await argon2.initBundle();
  return { worker, argon2 };
}
