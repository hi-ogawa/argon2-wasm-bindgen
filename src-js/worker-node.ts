import { Worker } from "node:worker_threads";
import { Argon2 } from "./worker-node-main";
import {
  proxyRpc,
  messagePortClientAdapter,
} from "@hiogawa/tiny-rpc/dist/index-v2";
import { newPromiseWithResolvers } from "@hiogawa/utils";
import crypto from "node:crypto";

export type { Argon2 };

declare let DEFINE_WORKER_CODE: string;

export async function initWorker() {
  const url = new URL(
    `data:text/javascript,${encodeURIComponent(DEFINE_WORKER_CODE)}`
  );
  const worker = new Worker(url);
  const channel = new MessageChannel();
  await handshakeServer(worker, channel.port1);
  const argon2 = proxyRpc<Argon2>({
    adapter: messagePortClientAdapter({ port: channel.port2 }),
  });
  return { worker, argon2 };
}

async function handshakeServer(worker: Worker, port: MessagePort) {
  const { promise, resolve, reject } = newPromiseWithResolvers<void>();
  const id = crypto.randomUUID();
  worker.once("message", (ev) => {
    if (ev === id) {
      resolve();
    } else {
      reject(ev);
    }
  });
  worker.postMessage({ id, port }, [port as any]);
  // TODO: timeout
  await promise;
}
