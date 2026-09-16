import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { createRequire } from "node:module";
import vm from "node:vm";
const projectRequire = createRequire(resolve("package.json"));
const ts = projectRequire("typescript");

// Load the real TypeScript modules with isolated delivery/CMS dependencies.
// This keeps regression tests offline and uses the project's existing compiler.
export function sourceLoader(mocks = {}, globals = {}) {
  const require = projectRequire;
  const cache = new Map();
  function load(path) {
    const absolute = resolve(path);
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const output = ts.transpileModule(readFileSync(absolute, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
      fileName: absolute,
    }).outputText;
    const loadedModule = { exports: {} };
    cache.set(absolute, loadedModule);
    const localRequire = (id) => {
      if (Object.hasOwn(mocks, id)) return mocks[id];
      if (!id.startsWith("@/") && !id.startsWith(".")) return require(id);
      const base = id.startsWith("@/")
        ? resolve("src", id.slice(2))
        : resolve(dirname(absolute), id);
      const candidate = [`${base}.ts`, `${base}.tsx`, base].find(existsSync);
      if (!candidate) throw new Error(`Cannot resolve ${id}`);
      return load(candidate);
    };
    vm.runInNewContext(
      output,
      {
        module: loadedModule,
        exports: loadedModule.exports,
        require: localRequire,
        URL,
        Date,
        console: { error() {}, info() {} },
        process: { env: {} },
        fetch: () => {
          throw new Error("Unexpected network request");
        },
        ...globals,
      },
      { filename: absolute },
    );
    return loadedModule.exports;
  }
  return load;
}
