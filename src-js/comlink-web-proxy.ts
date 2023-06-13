import { wrap } from "comlink";
import { Argon2 } from "./comlink-web";

declare let DEFINE_WORKER_CODE: string;

export async function initComlinkProxy() {
  const url = new URL(
    `data:text/javascript,${encodeURIComponent(DEFINE_WORKER_CODE)}`
  );
  const worker = new Worker(url, { type: "module" });
  const argon2 = wrap<Argon2>(worker);
  return { worker, argon2 };
}
