import { wrap } from "comlink";
import { Argon2 } from "./worker-web-main";
export type { Argon2 };

declare let DEFINE_WORKER_CODE: string;

export async function initWorker() {
  const url = new URL(
    `data:text/javascript,${encodeURIComponent(DEFINE_WORKER_CODE)}`
  );
  const worker = new Worker(url, { type: "module" });
  const argon2 = wrap<Argon2>(worker);
  return { worker, argon2 };
}
