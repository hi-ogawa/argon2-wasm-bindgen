import { beforeAll, describe, expect, it } from "vitest";
import initWasmBindGen, {
  hash_password,
  verify_password,
} from "../dist/index-tsup";
import { WASM_BASE64 } from "../dist/wasm-base64";

beforeAll(async () => {
  const wasmSource = Buffer.from(WASM_BASE64, "base64");
  const wasmModule = await WebAssembly.compile(wasmSource);
  await initWasmBindGen(wasmModule);
});

describe("bundle", () => {
  it("basic", async () => {
    const password = "password";
    const salt = btoa("salt".repeat(3));
    const password_hash = hash_password(password, salt);
    expect(password_hash).toMatchInlineSnapshot(
      '"$argon2id$v=19$m=19456,t=2,p=1$c2FsdHNhbHRzYWx0$83NhH4a54XrGQTfUWbmBlx7cfoFGhD1nGBk7kNt4L44"'
    );

    expect(verify_password(password, password_hash)).toMatchInlineSnapshot(
      "true"
    );
    expect(verify_password("wrong", password_hash)).toMatchInlineSnapshot(
      "false"
    );
  });
});
