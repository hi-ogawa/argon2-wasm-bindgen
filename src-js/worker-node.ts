import { Worker } from "node:worker_threads";
import { Argon2 } from "./worker-node-main";
import {
  proxyRpc,
  messagePortClientAdapter,
} from "@hiogawa/tiny-rpc/dist/index-v2";

export type { Argon2 };

declare let DEFINE_WORKER_CODE: string;

export async function initWorker() {
  const url = new URL(
    `data:text/javascript,${encodeURIComponent(DEFINE_WORKER_CODE)}`
  );
  const worker = new Worker(url);

  // TODO: confirm initial hand-shake?
  const channel = new MessageChannel();
  worker.postMessage({ port: channel.port1 }, [channel.port1 as any]);

  const argon2 = proxyRpc<Argon2>({
    adapter: messagePortClientAdapter({ port: channel.port2 }),
  });
  return { worker, argon2 };
}
