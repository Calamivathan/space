#!/usr/bin/env node
// Size-budget gate (per README §13). Walks dist/, sums gzipped JS+CSS, fails on overage.

import { readFileSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const DIST = "dist";
const BUDGETS = {
  js: 220 * 1024, // initial JS, gzipped
  css: 25 * 1024, // initial CSS, gzipped
  assets: 8 * 1024 * 1024, // total assets at idle
};

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function fmt(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

async function main() {
  let stat;
  try {
    stat = statSync(DIST);
  } catch {
    console.error(`size-budget: ${DIST}/ not found. Run \`pnpm build\` first.`);
    process.exit(2);
  }
  if (!stat.isDirectory()) {
    console.error(`size-budget: ${DIST} is not a directory.`);
    process.exit(2);
  }

  const tally = { js: 0, css: 0, assets: 0 };
  const rows = [];

  for await (const file of walk(DIST)) {
    const rel = relative(DIST, file);
    // Sourcemaps are dev-only artifacts; never served at idle.
    if (rel.endsWith(".map")) continue;

    const ext = extname(file).toLowerCase();
    const buf = readFileSync(file);
    const gz = gzipSync(buf).length;

    if (ext === ".js" || ext === ".mjs") tally.js += gz;
    else if (ext === ".css") tally.css += gz;
    else tally.assets += buf.length;

    rows.push({ rel, ext, raw: buf.length, gz });
  }

  rows.sort((a, b) => b.gz - a.gz);
  console.log("\nsize-budget — top 15 by gzipped size:");
  for (const r of rows.slice(0, 15)) {
    console.log(`  ${fmt(r.gz).padStart(8)}  (${fmt(r.raw).padStart(8)} raw)  ${r.rel}`);
  }

  const report = [
    ["js  (gz)", tally.js, BUDGETS.js],
    ["css (gz)", tally.css, BUDGETS.css],
    ["assets  ", tally.assets, BUDGETS.assets],
  ];

  console.log("\nbudget summary:");
  let failed = false;
  for (const [label, used, budget] of report) {
    const pct = ((used / budget) * 100).toFixed(1);
    const ok = used <= budget;
    if (!ok) failed = true;
    console.log(
      `  ${ok ? "OK " : "XX "} ${label}  ${fmt(used).padStart(9)} / ${fmt(budget)}  (${pct}%)`,
    );
  }

  if (failed) {
    console.error("\nsize-budget: FAIL — one or more budgets exceeded.");
    process.exit(1);
  }
  console.log("\nsize-budget: PASS");
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
