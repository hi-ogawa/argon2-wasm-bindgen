import * as argon2 from "@hiogawa/argon2-wasm-bindgen";
import { expose } from "comlink";

export type { Argon2Service };

class Argon2Service {
  async initialize() {
    await argon2.initBundle();
  }

  hash_password = argon2.hash_password;
  verify_password = argon2.verify_password;
}

function main() {
  const argon2Service = new Argon2Service();
  expose(argon2Service);
}

main();
