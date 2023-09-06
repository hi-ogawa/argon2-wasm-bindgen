import {
  Show,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  untrack,
} from "solid-js";
import { createStore } from "solid-js/store";
import { argon2, encodeSalt, initializeArgon2 } from "./argon2/proxy";
import { measureAsync } from "./utils";
import { getTheme, setTheme } from "@hiogawa/theme-script";

export function App() {
  const [argon2Resource] = createResource(initializeArgon2);
  const argon2Ready = createMemo(() => argon2Resource.state === "ready");

  createEffect(() => {
    const e = argon2Resource.error;
    if (e) {
      console.error(e);
      window.alert(
        "failed to load wasm" + (e instanceof Error ? `\n\n${e.message}` : "")
      );
    }
  });

  return (
    <div class="h-full flex flex-col">
      <AppHeader />
      <div class="flex justify-center">
        <div class="w-full max-w-md flex flex-col gap-6 p-6 relative">
          <Show when={!argon2Ready()}>
            <div class="absolute right-6 antd-spin w-6 h-6"></div>
          </Show>
          <HashPasswordForm />
          <div class="border-t"></div>
          <VerifyPasswordForm />
        </div>
      </div>
    </div>
  );
}

function AppHeader() {
  return (
    <header class="sticky top-0 antd-body z-1 flex items-center gap-3 p-2 px-4 shadow-md shadow-black/[0.05] dark:shadow-black/[0.7]">
      <h1 class="text-lg">Argon2 WasmBindgen</h1>
      <span class="flex-1"></span>
      <button
        class="light:i-ri-moon-line dark:i-ri-sun-line !w-6 !h-6"
        onClick={() => setTheme(getTheme() === "dark" ? "light" : "dark")}
      ></button>
      <a
        class="flex items-center antd-btn antd-btn-ghost"
        href="https://github.com/hi-ogawa/argon2-wasm-bindgen"
        target="_blank"
      >
        <span class="i-ri-github-line w-6 h-6"></span>
      </a>
    </header>
  );
}

function HashPasswordForm() {
  const [output, setOutput] = createSignal("");
  const [time, setTime] = createSignal<number>();
  const [form, setForm] = createStore({
    password: "pepper",
    salt: "abcdefgh",
    m: 19 * 2 ** 10,
    t: 2,
    p: 1,
  });

  return (
    <div class="flex flex-col gap-3">
      <h2 class="text-xl">Hash Password</h2>
      <form
        class="flex flex-col gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            let result!: string;
            // very rough measurement including worker communication
            const time = await measureAsync(async () => {
              result = await argon2.hash_password(
                form.password,
                encodeSalt(form.salt),
                undefined,
                undefined,
                form.m,
                form.t,
                form.p
              );
            });
            setOutput(result);
            setTime(time);
          } catch (e) {
            console.error(e);
            window.alert(
              "failed to hash password" +
                (e instanceof Error ? `\n\n${e.message}` : "")
            );
          }
        }}
      >
        <label class="flex flex-col gap-1">
          <span>Password</span>
          <input
            class="antd-input px-1"
            required
            value={untrack(() => form.password)}
            onChange={(e) => setForm({ password: e.target.value })}
          />
        </label>
        <label class="flex flex-col gap-1">
          <span class="flex items-baseline gap-2">
            <span>Salt</span>
            <span class="text-colorTextLabel text-sm">
              (at least 8 characters)
            </span>
          </span>
          <input
            class="antd-input px-1"
            minLength={8}
            value={untrack(() => form.salt)}
            onChange={(e) => setForm({ salt: e.target.value })}
          />
        </label>
        <label class="flex flex-col gap-1">
          <span class="flex items-baseline gap-2">
            <span>M cost</span>
          </span>
          <input
            type="number"
            class="antd-input px-1"
            value={untrack(() => form.m)}
            onChange={(e) => setForm({ m: e.target.valueAsNumber })}
          />
        </label>
        <label class="flex flex-col gap-1">
          <span class="flex items-baseline gap-2">
            <span>T cost</span>
          </span>
          <input
            type="number"
            class="antd-input px-1"
            value={untrack(() => form.t)}
            onChange={(e) => setForm({ t: e.target.valueAsNumber })}
          />
        </label>
        <label class="flex flex-col gap-1">
          <span class="flex items-baseline gap-2">
            <span>P cost</span>
          </span>
          <input
            type="number"
            class="antd-input px-1"
            value={untrack(() => form.p)}
            onChange={(e) => setForm({ p: e.target.valueAsNumber })}
          />
        </label>
        <button class="antd-btn antd-btn-primary p-1">Hash</button>
      </form>
      <label class="flex flex-col gap-1">
        <span class="flex items-baseline gap-1">
          Output
          <Show when={time()}>
            {(t) => (
              <span class="text-colorTextLabel text-sm">
                (finished in {Math.ceil(t())}ms)
              </span>
            )}
          </Show>
        </span>
        <textarea
          class="antd-input p-1 bg-colorBgContainerDisabled font-mono"
          readOnly
          rows={4}
          value={output()}
        />
      </label>
    </div>
  );
}

function VerifyPasswordForm() {
  const [output, setOutput] = createSignal<boolean>();
  const [time, setTime] = createSignal<number>();
  const [form, setForm] = createStore({
    password: "pepper",
    passwordHash: "",
  });

  return (
    <div class="flex flex-col gap-3">
      <h2 class="text-xl">Verify Password</h2>
      <form
        class="flex flex-col gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            let result!: boolean;
            const time = await measureAsync(async () => {
              result = await argon2.verify_password(
                form.password,
                form.passwordHash
              );
            });
            setOutput(result);
            setTime(time);
          } catch (e) {
            console.error(e);
            window.alert(
              "failed to verify password" +
                (e instanceof Error ? `\n\n${e.message}` : "")
            );
          }
        }}
      >
        <label class="flex flex-col gap-1">
          <span>Password</span>
          <input
            class="antd-input px-1"
            required
            value={untrack(() => form.password)}
            onChange={(e) => setForm({ password: e.target.value })}
          />
        </label>
        <label class="flex flex-col gap-1">
          <span>Password Hash</span>
          <textarea
            class="antd-input px-1 font-mono"
            required
            rows={4}
            onChange={(e) => setForm({ passwordHash: e.target.value })}
          />
        </label>
        <div class="flex flex-col gap-1">
          <button class="antd-btn antd-btn-primary p-1 flex justify-center items-center relative">
            <span>Verify</span>
            <Show when={output() === true}>
              <span class="absolute right-2 i-ri-thumb-up-line w-4 h-4"></span>
            </Show>
            <Show when={output() === false}>
              <span class="absolute right-2 i-ri-thumb-down-line w-4 h-4"></span>
            </Show>
          </button>
          <Show when={time()}>
            {(t) => (
              <span class="self-end text-colorTextLabel text-sm">
                (finished in {Math.ceil(t())}ms)
              </span>
            )}
          </Show>
        </div>
      </form>
    </div>
  );
}
