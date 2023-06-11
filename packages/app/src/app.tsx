import { createMemo, createResource, createSignal, untrack } from "solid-js";
import { createStore } from "solid-js/store";
import { argon2, encodeSalt, initializeArgon2 } from "./argon2-utils";

export function App() {
  return (
    <div class="h-full flex flex-col">
      <AppHeader />
      <div class="flex justify-center">
        <div class="w-full max-w-md flex flex-col p-4">
          <Argon2Form />
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

function Argon2Form() {
  const [output, setOutput] = createSignal("");

  const [resource] = createResource(initializeArgon2);
  const resouceReady = createMemo(() => resource.state === "ready");

  const [form, setForm] = createStore({
    password: "pepper",
    salt: "abcdefgh",
  });

  return (
    <div class="flex flex-col gap-3">
      <form
        class="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!resouceReady()) {
            return;
          }

          // TODO: use createResource.mutate and show error
          const result = argon2.hash_password(
            form.password,
            encodeSalt(form.salt)
          );
          setOutput(result);
        }}
      >
        <label class="flex flex-col gap-1">
          <span>Password</span>
          <input
            class="antd-input px-1"
            value={untrack(() => form.password)}
            onChange={(e) => setForm({ password: e.target.value })}
          />
        </label>
        <label class="flex flex-col gap-1">
          <span>Salt</span>
          <input
            class="antd-input px-1"
            value={untrack(() => form.salt)}
            onChange={(e) => setForm({ salt: e.target.value })}
          />
        </label>
        <button
          class="antd-btn antd-btn-primary p-1 my-2"
          disabled={!resouceReady()}
        >
          Hash Password
        </button>
      </form>
      <div class="border-t"></div>
      <label class="flex flex-col gap-1">
        <span>Output</span>
        <textarea
          class="antd-input p-1 bg-colorBgContainerDisabled"
          readOnly
          value={output()}
        />
      </label>
    </div>
  );
}
