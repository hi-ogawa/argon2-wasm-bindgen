import { beforeAll, describe, expect, it } from "vitest";
import { wasmBindgenModule, initializeBundle } from "../dist/index-wasm-bundle";

beforeAll(async () => {
  await initializeBundle();
});

describe("bundle", () => {
  it("basic", async () => {
    const password = "password";
    const salt = btoa("salt".repeat(3));
    const password_hash = wasmBindgenModule.hash_password(password, salt);
    expect(password_hash).toMatchInlineSnapshot(
      '"$argon2id$v=19$m=19456,t=2,p=1$c2FsdHNhbHRzYWx0$83NhH4a54XrGQTfUWbmBlx7cfoFGhD1nGBk7kNt4L44"'
    );

    expect(
      wasmBindgenModule.verify_password(password, password_hash)
    ).toMatchInlineSnapshot("true");
    expect(
      wasmBindgenModule.verify_password("wrong", password_hash)
    ).toMatchInlineSnapshot("false");
  });
});
