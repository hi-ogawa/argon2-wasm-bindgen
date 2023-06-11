import { beforeAll, describe, expect, it } from "vitest";
import initWasmBindgen, {
  verify_password,
  hash_password,
} from "../pkg/index.js";
import fs from "node:fs";

beforeAll(async () => {
  const wasmSource = await fs.promises.readFile("pkg/index_bg.wasm");
  const wasmModule = await WebAssembly.compile(wasmSource);
  await initWasmBindgen(wasmModule);
});

describe("example", () => {
  it("basic", async () => {
    // base64 encoding without "=" padding
    const salt_b64 = btoa("salt".repeat(3));
    expect(salt_b64).toMatchInlineSnapshot('"c2FsdHNhbHRzYWx0"');

    const password = "password";
    const password_hash = hash_password(password, salt_b64);
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

describe(hash_password, () => {
  const salt = btoa("salt".repeat(3));
  const password = "password";
  const defaultHash =
    "$argon2id$v=19$m=19456,t=2,p=1$c2FsdHNhbHRzYWx0$83NhH4a54XrGQTfUWbmBlx7cfoFGhD1nGBk7kNt4L44";

  // prettier-ignore
  it("algorithm", () => {
    expect(hash_password(password, salt, "argon2id")).toBe(defaultHash);
    expect(hash_password(password, salt, "argon2i")).toMatchInlineSnapshot('"$argon2i$v=19$m=19456,t=2,p=1$c2FsdHNhbHRzYWx0$I86DObwTlWeH+Vu+T95uamJzr/t05+PFM9FiI79I8Xw"');
    expect(hash_password(password, salt, "argon2d")).toMatchInlineSnapshot('"$argon2d$v=19$m=19456,t=2,p=1$c2FsdHNhbHRzYWx0$10L9NMz1ILL9WokFeVqIPlaF1PWUaGJQfTp8nFplk24"');
    expect(() => hash_password(password, salt, "argon2di")).toThrowErrorMatchingInlineSnapshot('"[Algorithm::new] algorithm identifier invalid"');
  })

  // prettier-ignore
  it("version", () => {
    expect(hash_password(password, salt, undefined, 0x13)).toBe(defaultHash);
    expect(hash_password(password, salt, undefined, 0x10)).toMatchInlineSnapshot('"$argon2id$v=16$m=19456,t=2,p=1$c2FsdHNhbHRzYWx0$GMa1LhGdQz9q0EFzHI4f20Q22VHnH3oQzDltDC3C23Q"');
    expect(() => hash_password(password, salt, undefined, 0xff)).toThrowErrorMatchingInlineSnapshot('"[Version::try_from] invalid version"');
  })

  // prettier-ignore
  it("m", () => {
    expect(hash_password(password, salt, undefined, undefined, 19 * 2 ** 10)).toBe(defaultHash);
    expect(hash_password(password, salt, undefined, undefined, 1 << 16)).toMatchInlineSnapshot('"$argon2id$v=19$m=65536,t=2,p=1$c2FsdHNhbHRzYWx0$b0VD2bmMyKW82pv/cxMd7oF3WrAT9MTefZrFp6u+CpQ"');
    expect(() => hash_password(password, salt, undefined, undefined, 0)).toThrowErrorMatchingInlineSnapshot('"[ParamsBuilder::build] memory cost is too small"');
  })

  // prettier-ignore
  it("t", () => {
    expect(hash_password(password, salt, undefined, undefined, undefined, 2)).toBe(defaultHash);
    expect(hash_password(password, salt, undefined, undefined, undefined, 1)).toMatchInlineSnapshot('"$argon2id$v=19$m=19456,t=1,p=1$c2FsdHNhbHRzYWx0$KAHX+qhUAwDVBjHKnsTTrJJ04WC6bkj+zPZsdnqK2Fc"');
    expect(() => hash_password(password, salt, undefined, undefined, undefined, 0)).toThrowErrorMatchingInlineSnapshot('"[ParamsBuilder::build] time cost is too small"');
  })

  // prettier-ignore
  it("p", () => {
    expect(hash_password(password, salt, undefined, undefined, undefined, undefined, 1)).toBe(defaultHash);
    expect(hash_password(password, salt, undefined, undefined, undefined, undefined, 2)).toMatchInlineSnapshot('"$argon2id$v=19$m=19456,t=2,p=2$c2FsdHNhbHRzYWx0$V31r8scvo/zd2rPuDAKQWy4ad3u5iAuMMF7fkloEn+Y"');
    expect(() => hash_password(password, salt, undefined, undefined, undefined, undefined, 0)).toThrowErrorMatchingInlineSnapshot('"[ParamsBuilder::build] not enough threads"');
  })

  it("invalid salt", async () => {
    const salt = btoa("salt".repeat(4));
    expect(salt).toMatchInlineSnapshot('"c2FsdHNhbHRzYWx0c2FsdA=="');

    expect(() =>
      hash_password("pepper", salt)
    ).toThrowErrorMatchingInlineSnapshot(
      "\"[Salt::from_b64] salt invalid: contains invalid character: '='\""
    );
  });
});

describe(verify_password, () => {
  it("invalid hash", () => {
    const bad_hash = "$@asdfjkl;";
    expect(() =>
      verify_password("password", bad_hash)
    ).toThrowErrorMatchingInlineSnapshot(
      '"[PasswordHash::new] invalid parameter name"'
    );
  });
});
