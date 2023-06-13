import * as argon2 from "@hiogawa/argon2-wasm-bindgen";
import { expose } from "comlink";

// expose argon2 as comlink service

export type { Argon2Comlink };

class Argon2Comlink {
  async initialize() {
    await argon2.initBundle();
  }
  hash_password = argon2.hash_password;
  verify_password = argon2.verify_password;
}

function main() {
  const argon2Comlink = new Argon2Comlink();
  expose(argon2Comlink);
}

main();
