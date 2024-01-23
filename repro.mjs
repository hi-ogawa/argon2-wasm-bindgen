const mod = await WebAssembly.compile(fs.readFile("./pkg/index_bg.wasm"))
const imports = WebAssembly.Module.imports(mod)
// [ { module: 'wbg', name: '__wbindgen_error_new', kind: 'function' } ]

const exports = WebAssembly.Module.exports(mod)
// [
//   { name: 'memory', kind: 'memory' },
//   { name: 'hash_password', kind: 'function' },
//   { name: 'verify_password', kind: 'function' },
//   { name: '__wbindgen_add_to_stack_pointer', kind: 'function' },
//   { name: '__wbindgen_malloc', kind: 'function' },
//   { name: '__wbindgen_realloc', kind: 'function' },
//   { name: '__wbindgen_free', kind: 'function' }
// ]
