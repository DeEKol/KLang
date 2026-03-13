#!/usr/bin/env node

"use strict";

/* eslint-disable no-console */

/**
 * dump-structure.mjs
 *
 * Dumps project file structure + optionally file contents for AI analysis.
 *
 * Usage:
 *   node scripts/dump-structure.mjs                        # tree from src/
 *   node scripts/dump-structure.mjs --root .               # tree from project root
 *   node scripts/dump-structure.mjs --module src/features/auth
 *   node scripts/dump-structure.mjs --module src/entities/auth --content
 *   node scripts/dump-structure.mjs --module src/entities/auth --content --mini
 *   node scripts/dump-structure.mjs --content --mini       # all src/ minified
 *
 * Options:
 *   --root <dir>       Start from this directory (default: src/)
 *   --module <path>    Scope to a specific subdirectory
 *   --content          Include file contents (first 80 lines per file)
 *   --mini             Minified output: strip comments, blank lines, collapse whitespace
 *   --lines <n>        Max lines per file when --content is set (default: 80)
 *   --ext <exts>       Comma-separated extensions to include (default: ts,tsx)
 *   --out <file>       Write output to file instead of stdout
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { extname, join, relative } from "path";
import { parseArgs } from "util";

// ── CLI args ──────────────────────────────────────────────────────────────────

const { values: args } = parseArgs({
  options: {
    root: { type: "string" },
    module: { type: "string" },
    content: { type: "boolean", default: false },
    mini: { type: "boolean", default: false },
    lines: { type: "string", default: "80" },
    ext: { type: "string", default: "ts,tsx" },
    out: { type: "string" },
  },
  strict: false,
});

const projectRoot = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const extensions = args.ext.split(",").map((e) => (e.startsWith(".") ? e : `.${e}`));
const maxLines = parseInt(args.lines, 10);

const startDir = args.module
  ? join(projectRoot, args.module)
  : join(projectRoot, args.root ?? "src");

if (!existsSync(startDir)) {
  console.error(`Directory not found: ${startDir}`);
  process.exit(1);
}

// ── Ignore patterns ───────────────────────────────────────────────────────────

const IGNORE_DIRS = new Set(["node_modules", ".git", "dist", "build", "android", "ios", ".expo"]);
const IGNORE_FILES = new Set(["index.ts"]); // change if you want index files too

// ── File walker ───────────────────────────────────────────────────────────────

/** @returns {{ path: string, rel: string }[]} */
function walk(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full));
    } else if (extensions.includes(extname(entry.name))) {
      results.push({ path: full, rel: relative(projectRoot, full) });
    }
  }
  return results;
}

// ── Minifier ──────────────────────────────────────────────────────────────────

function minify(src) {
  return src
    .split("\n")
    .map((line) => {
      // strip single-line comments (but not URLs like https://)
      return line.replace(/(?<!:)\/\/(?!\/)[^\n]*/g, "").trimEnd();
    })
    .filter((line) => {
      const t = line.trim();
      // remove blank lines and block-comment lines
      return t.length > 0 && t !== "*" && !t.startsWith("* ") && !t.startsWith("/*") && t !== "*/";
    })
    .map((line) => {
      // collapse repeated whitespace (but not leading indentation context)
      return line.replace(/\s{2,}/g, " ");
    })
    .join("\n");
}

// ── Build output ──────────────────────────────────────────────────────────────

const files = walk(startDir);
const lines = [];

// Header
lines.push(`# Project structure dump`);
lines.push(`# Root: ${relative(projectRoot, startDir)}`);
lines.push(`# Files: ${files.length}  |  Extensions: ${extensions.join(", ")}`);
lines.push(`# Mode: ${args.content ? (args.mini ? "content+minified" : "content") : "tree only"}`);
lines.push("");

// Tree
lines.push("## File tree");
lines.push("```");
for (const f of files) {
  lines.push(f.rel);
}
lines.push("```");
lines.push("");

// Contents
if (args.content) {
  lines.push("## File contents");
  for (const { path, rel } of files) {
    lines.push(`\n### ${rel}`);
    lines.push("```ts");
    try {
      const raw = readFileSync(path, "utf8");
      const src = args.mini ? minify(raw) : raw;
      const sliced = src.split("\n").slice(0, maxLines).join("\n");
      const total = src.split("\n").length;
      lines.push(sliced);
      if (total > maxLines) {
        lines.push(`// ... (${total - maxLines} more lines, use --lines ${total} to see all)`);
      }
    } catch {
      lines.push("// [could not read file]");
    }
    lines.push("```");
  }
}

// ── Output ────────────────────────────────────────────────────────────────────

const output = lines.join("\n");

if (args.out) {
  writeFileSync(join(projectRoot, args.out), output, "utf8");
  console.log(`Written to ${args.out} (${output.length} chars, ${files.length} files)`);
} else {
  process.stdout.write(output + "\n");
}
