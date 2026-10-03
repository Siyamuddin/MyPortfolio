// This adapter implements only the directory lookup used by Next 15.5.25's
// ESLint plugin. See README.md before updating the scoped dependency override.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { isAbsolute } = require("node:path");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { globSync: tinyGlobSync } = require("tinyglobby");

function globSync(pattern, options) {
  if (typeof pattern !== "string" || options?.onlyDirectories !== true ||
      Object.keys(options).some((key) => key !== "onlyDirectories")) {
    throw new TypeError("The Next ESLint glob adapter only supports directory root lookups.");
  }

  // fast-glob treats literal directories as single matches and preserves
  // absolute input paths. tinyglobby requires these options explicitly.
  // fast-glob's terminal globstar selects descendants, not the parent itself.
  const directoryPattern = pattern.replace(/\/\*\*\/?$/, "/**/*");
  const matches = tinyGlobSync(directoryPattern, {
    onlyDirectories: true,
    expandDirectories: false,
    absolute: isAbsolute(pattern),
  });
  const keepTrailingSlash = pattern.endsWith("/") && !/[*?\[\]()]/.test(pattern);
  const keepDotPrefix = pattern.startsWith("./");

  return matches.map((match) => {
    let root = match.replace(/\/$/, "");
    if (keepTrailingSlash) root += "/";
    if (keepDotPrefix && !root.startsWith("./")) root = `./${root}`;
    return root;
  });
}

module.exports = { globSync };
