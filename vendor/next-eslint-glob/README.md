# Next ESLint directory lookup adapter

The scoped npm override replaces only `@next/eslint-plugin-next@15.5.25`'s
`fast-glob` dependency. That plugin uses only
`globSync(pattern, { onlyDirectories: true })` to locate configured Next roots.
Runtime Next.js and the lint rules remain on 15.5.25.
The explicit local dev dependency and `$fast-glob` override reference ensure
npm resolves the adapter consistently from the repository root on clean installs.

This removes the unpatched `braces` dependency behind
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
The adapter uses the maintained `tinyglobby` implementation, disables automatic
directory expansion, and preserves absolute paths and ordinary directory
formatting. The [tinyglobby migration guidance](https://superchupu.dev/tinyglobby/documentation#expandDirectories)
requires disabling directory expansion when replacing `fast-glob`.

This is deliberately not a general replacement for the full `fast-glob` API.
Unexpected options fail explicitly. Tests exercise the actual Next plugin's
root resolution, including literal, absolute, wildcard and multiple roots.
Remove the override when a supported Next ESLint release no longer requires
the affected dependency; recheck its API before updating the version scope.
