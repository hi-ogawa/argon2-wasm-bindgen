import { Argon2 } from "./worker-web-main";
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
  const worker = new Worker(url, { type: "module" });
  const argon2 = proxyRpc<Argon2>({
    adapter: messagePortClientAdapter({
      port: worker,
    }),
  });
  await argon2.initBundle();
  return { worker, argon2 };
}
