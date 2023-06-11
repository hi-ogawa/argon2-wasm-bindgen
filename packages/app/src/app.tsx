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
  return (
    <div class="flex flex-col gap-3">
      <label class="flex flex-col gap-1">
        <span>Password</span>
        <input class="antd-input px-1" />
      </label>
      <label class="flex flex-col gap-1">
        <span>Salt</span>
        <input class="antd-input px-1" />
      </label>
      <label class="flex flex-col gap-1">
        <span>Generated Hash</span>
        <textarea class="antd-input p-1 bg-colorBgContainerDisabled" readOnly />
      </label>
    </div>
  );
}
