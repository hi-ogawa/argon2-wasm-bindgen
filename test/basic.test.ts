import { beforeAll, describe, expect, it } from "vitest";
import {
  initSync,
  hash_password_simple,
  verify_password,
} from "../pkg/index.js";
import fs from "node:fs";

beforeAll(async () => {
  const wasmSource = await fs.promises.readFile("pkg/index_bg.wasm");
  const wasmModule = await WebAssembly.compile(wasmSource);
  initSync(wasmModule);
});

describe(hash_password_simple, () => {
  it("basic", async () => {
    const salt = btoa("salt".repeat(3));
    expect(salt).toMatchInlineSnapshot('"c2FsdHNhbHRzYWx0"');

    const result = hash_password_simple("pepper", salt);
    expect(result).toMatchInlineSnapshot(
      '"$argon2id$v=19$m=19456,t=2,p=1$c2FsdHNhbHRzYWx0$In0aM6WcpzTnOC0J2iJ8Us5IfVCteAX3tEfKF2tNlIQ"'
    );
  });

  it("invalid salt", async () => {
    const salt = btoa("salt".repeat(4));
    expect(salt).toMatchInlineSnapshot('"c2FsdHNhbHRzYWx0c2FsdA=="');

    expect(() =>
      hash_password_simple("pepper", salt)
    ).toThrowErrorMatchingInlineSnapshot(
      "\"[Salt::from_b64] salt invalid: contains invalid character: '='\""
    );
  });
});

describe("example", () => {
  it("basic", async () => {
    // base64 encoding without "=" padding
    const salt_b64 = btoa("salt".repeat(3));
    expect(salt_b64).toMatchInlineSnapshot('"c2FsdHNhbHRzYWx0"');

    const password = "pepper";
    const password_hash = hash_password_simple(password, salt_b64);
    expect(password_hash).toMatchInlineSnapshot(
      '"$argon2id$v=19$m=19456,t=2,p=1$c2FsdHNhbHRzYWx0$In0aM6WcpzTnOC0J2iJ8Us5IfVCteAX3tEfKF2tNlIQ"'
    );

    expect(verify_password(password, password_hash)).toMatchInlineSnapshot(
      "true"
    );
    expect(verify_password("wrong", password_hash)).toMatchInlineSnapshot(
      "false"
    );
  });
});
