import { beforeAll, describe, expect, it } from "vitest";
import { initWorker } from "../dist/worker-node";

let worker: Awaited<ReturnType<typeof initWorker>>;

beforeAll(async () => {
  worker = await initWorker();
  return () => worker.worker.terminate();
});

describe("bundle", () => {
  // prettier-ignore
  it("basic", async () => {
    const argon2 = worker.argon2;

    const password = "password";
    const salt = btoa("salt".repeat(3));
    const password_hash = await argon2.hash_password(password, salt);
    expect(password_hash).toMatchInlineSnapshot('"$argon2id$v=19$m=19456,t=2,p=1$c2FsdHNhbHRzYWx0$83NhH4a54XrGQTfUWbmBlx7cfoFGhD1nGBk7kNt4L44"');

    expect(await argon2.verify_password(password, password_hash)).toMatchInlineSnapshot("true");
    expect(await argon2.verify_password("wrong", password_hash)).toMatchInlineSnapshot("false");
  });
});
