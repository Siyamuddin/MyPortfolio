import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { after, test } from "node:test";

const require = createRequire(import.meta.url);
const { getRootDirs } = require("@next/eslint-plugin-next/dist/utils/get-root-dirs.js");
const fixture = mkdtempSync(join(tmpdir(), "portfolio eslint roots "));
const app = join(fixture, "apps", "web app");
const admin = join(fixture, "apps", "admin");
mkdirSync(join(app, "src", "app"), { recursive: true });
mkdirSync(admin, { recursive: true });
writeFileSync(join(fixture, "apps", "README.md"), "not an application directory");
after(() => rmSync(fixture, { recursive: true, force: true }));

function resolve(rootDir) {
  return getRootDirs({ cwd: process.cwd(), settings: { next: { rootDir } } });
}

test("Next lint keeps the current directory when no roots are configured", () => {
  assert.deepEqual(resolve(undefined), [process.cwd()]);
});

test("Next lint resolves one literal root without including its children", () => {
  const root = relative(process.cwd(), app);
  assert.deepEqual(resolve(root), [root]);
  assert.deepEqual(resolve(`${root}/`), [`${root}/`]);
  assert.deepEqual(resolve(app), [app]);
  assert.deepEqual(resolve(`${app}/`), [`${app}/`]);
});

test("Next lint resolves absolute and relative root globs and skips files", () => {
  assert.deepEqual(resolve(join(fixture, "apps", "*")).sort(), [admin, app].sort());
  const pattern = relative(process.cwd(), join(fixture, "apps", "*"));
  assert.deepEqual(resolve(pattern).sort(), [admin, app].map((root) => relative(process.cwd(), root)).sort());
});

test("Next lint resolves arrays of roots, missing roots and brace patterns", () => {
  assert.deepEqual(resolve([app, admin, 42]), [app, admin]);
  assert.deepEqual(resolve(join(fixture, "missing")), []);
  assert.deepEqual(resolve(join(fixture, "apps", "{admin,web app}")).sort(), [admin, app].sort());
});

test("Next lint recursive roots include descendants without selecting the parent", () => {
  assert.deepEqual(resolve(`${app}/**`).sort(), [join(app, "src"), join(app, "src", "app")].sort());
  assert.deepEqual(resolve(`${app}/**/`).sort(), [join(app, "src"), join(app, "src", "app")].sort());
  assert.deepEqual(resolve("./"), ["./"]);
});
