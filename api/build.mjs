import * as esbuild from "esbuild";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

await esbuild.build({
  entryPoints: [join(__dirname, "workers/app.ts")],
  bundle: true,
  outfile: join(__dirname, "dist/index.js"),
  format: "esm",
  platform: "browser",
  target: "es2022",
  minify: false,
  sourcemap: true,
  external: [],
  conditions: ["worker", "browser"],
  mainFields: ["worker", "browser", "module", "main"],
});

const pkg = JSON.parse(readFileSync(join(__dirname, "package.json"), "utf-8"));
const outputPkg = {
  name: pkg.name,
  version: pkg.version,
  private: true,
  main: "index.js",
  type: "module",
};

writeFileSync(join(__dirname, "dist/package.json"), JSON.stringify(outputPkg, null, 2));

console.log("Build complete: dist/index.js");
