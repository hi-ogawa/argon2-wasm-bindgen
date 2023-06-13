import * as argon2 from "@hiogawa/argon2-wasm-bindgen";
import { expose } from "comlink";

export type Argon2 = typeof argon2;

function main() {
  expose(argon2);
}

main();
