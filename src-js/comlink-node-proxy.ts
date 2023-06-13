import { wrap } from "comlink";
import comlinkNodeAdapter from "comlink/dist/umd/node-adapter";
import { Worker } from "node:worker_threads";
import { Argon2 } from "./comlink-node";

declare let DEFINE_WORKER_CODE: string;

export async function initComlinkProxy() {
  const url = new URL(
    `data:text/javascript,${encodeURIComponent(DEFINE_WORKER_CODE)}`
  );
  const worker = new Worker(url);
  const argon2 = wrap<Argon2>(comlinkNodeAdapter(worker));
  return { worker, argon2 };
}
