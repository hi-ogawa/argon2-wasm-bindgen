import { Worker } from "node:worker_threads";
import { Argon2 } from "./worker-node-main";
import {
  proxyTinyRpc,
  messagePortClientAdapter,
  messagePortNodeCompat,
  TinyRpcProxy,
} from "@hiogawa/tiny-rpc";

export type Argon2Proxy = TinyRpcProxy<Argon2>;

declare let DEFINE_WORKER_CODE: string;

export async function initWorker() {
  const url = new URL(
    `data:text/javascript,${encodeURIComponent(DEFINE_WORKER_CODE)}`
  );
  const worker = new Worker(url);
  const argon2 = proxyTinyRpc<Argon2>({
    adapter: messagePortClientAdapter({ port: messagePortNodeCompat(worker) }),
  });
  await argon2.initBundle();
  return { worker, argon2 };
}
