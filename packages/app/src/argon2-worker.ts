import WASM_URL from "@hiogawa/argon2-wasm-bindgen/pkg/index_bg.wasm?url";
import initArgon2 from "@hiogawa/argon2-wasm-bindgen";
import * as argon2 from "@hiogawa/argon2-wasm-bindgen";
import { expose } from "comlink";

export type { Argon2Service };

class Argon2Service {
  async initialize() {
    await initArgon2(WASM_URL);
  }

  // TODO: measure time
  hash_password = argon2.hash_password;
  verify_password = argon2.verify_password;
}

function main() {
  const argon2Service = new Argon2Service();
  expose(argon2Service);
}

main();
