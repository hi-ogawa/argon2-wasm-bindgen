import * as argon2 from "./bundle";
import { expose } from "comlink";
import comlinkNodeAdapter from "comlink/dist/umd/node-adapter";
import { parentPort } from "node:worker_threads";

export type Argon2 = typeof argon2;

function main() {
  expose(argon2, comlinkNodeAdapter(parentPort!));
}

main();
