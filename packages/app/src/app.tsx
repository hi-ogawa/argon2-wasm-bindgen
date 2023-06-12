import {
  Show,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  untrack,
} from "solid-js";
import { createStore } from "solid-js/store";
import { argon2, encodeSalt, initializeArgon2 } from "./argon2-utils";

export function App() {
  const [argon2Resource] = createResource(initializeArgon2);
  const argon2Ready = createMemo(() => argon2Resource.state === "ready");

  createEffect(() => {
    if (argon2Resource.error) {
      console.error(argon2Resource.error);
      window.alert("failed to load wasm");
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
    <header class="flex items-center gap-2 p-2 px-4 shadow-md shadow-black/[0.05] dark:shadow-black/[0.7]">
      <h1 class="text-lg">Argon2 WasmBindgen</h1>
      <span class="flex-1"></span>
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
  const [form, setForm] = createStore({
    password: "pepper",
    salt: "abcdefgh",
  });

  return (
    <div class="flex flex-col gap-3">
      <h2 class="text-xl">Hash Password</h2>
      <form
        class="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            const result = argon2.hash_password(
              form.password,
              encodeSalt(form.salt)
            );
            setOutput(result);
          } catch (e) {
            console.error(e);
            window.alert("failed to hash password");
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
        <button class="antd-btn antd-btn-primary p-1 my-2">Hash</button>
      </form>
      <label class="flex flex-col gap-1">
        <span>Output</span>
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
  const [form, setForm] = createStore({
    password: "",
    passwordHash: "",
  });

  return (
    <div class="flex flex-col gap-3">
      <h2 class="text-xl">Verify Password</h2>
      <form
        class="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          try {
            const result = argon2.verify_password(
              form.password,
              form.passwordHash
            );
            setOutput(result);
          } catch (e) {
            console.error(e);
            window.alert("failed to verify password");
          }
        }}
      >
        <label class="flex flex-col gap-1">
          <span>Password</span>
          <input
            class="antd-input px-1"
            required
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
        <button class="antd-btn antd-btn-primary p-1 my-2 flex justify-center items-center relative">
          <span>Verify</span>
          <Show when={output() === true}>
            <span class="absolute right-2 i-ri-thumb-up-line w-4 h-4"></span>
          </Show>
          <Show when={output() === false}>
            <span class="absolute right-2 i-ri-thumb-down-line w-4 h-4"></span>
          </Show>
        </button>
      </form>
    </div>
  );
}
