#!/usr/bin/env node

"use strict";

/* eslint-disable no-console */

/**
 * check-unused-styles.mjs
 *
 * Finds style keys defined in *.styles.ts files that are not used
 * in the corresponding component file (*.tsx / *.ts).
 *
 * Usage:
 *   node scripts/check-unused-styles.mjs           # scan src/
 *   node scripts/check-unused-styles.mjs src/screens  # scan subtree
 *
 * Exit codes:
 *   0 — all styles are used (or no styles files found)
 *   1 — unused styles detected
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ─── Config ──────────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = process.argv[2] ? path.resolve(process.argv[2]) : path.join(ROOT, "src");

const STYLE_SUFFIX = ".styles.ts";
const COMPONENT_EXTS = [".tsx", ".ts"];

// ─── ANSI helpers ─────────────────────────────────────────────────────────────

const c = {
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

// ─── File discovery ───────────────────────────────────────────────────────────

function walk(dir, results = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      walk(full, results);
    } else if (e.isFile() && e.name.endsWith(STYLE_SUFFIX)) {
      results.push(full);
    }
  }
  return results;
}

function findComponentFile(stylesFile) {
  const base = stylesFile.slice(0, -STYLE_SUFFIX.length);
  for (const ext of COMPONENT_EXTS) {
    const candidate = base + ext;
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

// ─── Style key extraction ─────────────────────────────────────────────────────

/**
 * Extract top-level keys from every StyleSheet.create({...}) call in the file.
 * Uses brace-depth tracking so CSS properties nested inside style objects
 * (alignSelf, color, etc.) are never mistaken for style class names.
 */
function extractStyleKeys(content) {
  const keys = new Set();
  const createRe = /StyleSheet\.create\s*\(\s*\{/g;
  let match;

  while ((match = createRe.exec(content)) !== null) {
    let depth = 1;
    let i = match.index + match[0].length;

    while (i < content.length && depth > 0) {
      if (content[i] === "{") depth++;
      else if (content[i] === "}") depth--;
      i++;
    }

    const block = content.slice(match.index + match[0].length, i - 1);
    let pos = 0;
    let innerDepth = 0;

    while (pos < block.length) {
      const ch = block[pos];
      if (ch === "{") {
        innerDepth++;
      } else if (ch === "}") {
        innerDepth--;
      } else if (innerDepth === 0) {
        const keyMatch = block.slice(pos).match(/^(\w+)\s*:/);
        if (keyMatch) {
          keys.add(keyMatch[1]);
          pos += keyMatch[0].length;
          continue;
        }
      }
      pos++;
    }
  }

  return keys;
}

// ─── Usage detection in component ────────────────────────────────────────────

function findUsedKeys(content) {
  const used = new Set();

  // styles.keyName  (most common)
  const dotRe = /\bstyles\.(\w+)\b/g;
  let m;
  while ((m = dotRe.exec(content)) !== null) used.add(m[1]);

  // const { a, b } = styles  OR  const { a, b } = createStyles(...)
  const destructRe = /const\s*\{\s*([^}]+)\}\s*=\s*(?:styles\b|createStyles\b[^;]*)/g;
  while ((m = destructRe.exec(content)) !== null) {
    m[1].split(",").forEach((part) => {
      const key = part
        .trim()
        .split(/\s*:\s*/)[0]
        .trim();
      if (key) used.add(key);
    });
  }

  return used;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const styleFiles = walk(SRC_DIR);

if (styleFiles.length === 0) {
  console.log(c.yellow("No *.styles.ts files found in " + SRC_DIR));
  process.exit(0);
}

console.log(
  c.bold(
    `\nChecking ${styleFiles.length} *.styles.ts file(s) in ${path.relative(ROOT, SRC_DIR)}/\n`,
  ),
);

const results = { unused: [], skipped: [], ok: [] };

for (const stylesFile of styleFiles) {
  const rel = path.relative(ROOT, stylesFile);
  const componentFile = findComponentFile(stylesFile);

  if (!componentFile) {
    results.skipped.push({ rel });
    continue;
  }

  const defined = extractStyleKeys(fs.readFileSync(stylesFile, "utf8"));
  const used = findUsedKeys(fs.readFileSync(componentFile, "utf8"));
  const unusedKeys = [...defined].filter((k) => !used.has(k));

  if (unusedKeys.length > 0) {
    results.unused.push({ rel, keys: unusedKeys });
  } else {
    results.ok.push({ rel });
  }
}

// ─── Output ───────────────────────────────────────────────────────────────────

function printSection(title, color, items, renderItem) {
  if (items.length === 0) return;
  const dashes = "─".repeat(Math.max(0, 50 - title.length - String(items.length).length));
  console.log(color(c.bold(`── ${title} (${items.length}) ${dashes}`)));
  items.forEach(renderItem);
  console.log("");
}

printSection("UNUSED", c.red, results.unused, ({ rel, keys }) => {
  console.log(`  ${c.red("✗")} ${rel}`);
  keys.forEach((k) => console.log(`      ${c.dim("→")} ${c.red(k)}`));
});

printSection("SKIPPED", c.yellow, results.skipped, ({ rel }) => {
  console.log(`  ${c.yellow("?")} ${c.dim(rel)}  ${c.dim("(no component file)")}`);
});

printSection("OK", c.green, results.ok, ({ rel }) => {
  console.log(`  ${c.green("✓")} ${c.dim(rel)}`);
});

// ─── Summary ──────────────────────────────────────────────────────────────────

const totalUnused = results.unused.reduce((n, r) => n + r.keys.length, 0);

console.log(c.dim("─".repeat(55)));
console.log(
  `  ${c.green(`✓ ${results.ok.length} ok`)}` +
    `  ${c.yellow(`? ${results.skipped.length} skipped`)}` +
    `  ${totalUnused > 0 ? c.red(`✗ ${results.unused.length} files, ${totalUnused} key(s)`) : c.green("✗ 0 unused")}`,
);
console.log("");

if (totalUnused > 0) {
  console.log(c.bold(c.red(`Found ${totalUnused} unused style key(s). Fix or remove them.\n`)));
  process.exit(1);
} else {
  console.log(c.bold(c.green("All styles are used.\n")));
  process.exit(0);
}
