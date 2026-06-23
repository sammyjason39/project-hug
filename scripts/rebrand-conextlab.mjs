#!/usr/bin/env node
/**
 * Safe ConextLab class migration — only mutates Tailwind class strings.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TARGET_DIRS = [
  path.join(ROOT, "src/pages"),
  path.join(ROOT, "src/components"),
  path.join(ROOT, "src/core/ui"),
  path.join(ROOT, "src/layouts"),
];

const CLASS_REPLACEMENTS = [
  [/text-\[10px\]\s+font-black\s+uppercase\s+tracking-\[0\.2em\]/g, "text-label"],
  [/text-\[9px\]\s+font-black\s+uppercase\s+tracking-\[0\.5em\]/g, "text-label"],
  [/text-\[9px\]\s+font-black\s+uppercase\s+tracking-widest/g, "text-label"],
  [/text-\[9px\]\s+font-black\s+uppercase\s+tracking-\[0\.2em\]/g, "text-label"],
  [/text-\[8px\]\s+font-black\s+uppercase[^\s"]*/g, "text-label"],
  [/font-black\s+italic\s+uppercase/g, "font-semibold"],
  [/font-black\s+uppercase/g, "font-semibold"],
  [/font-black\s+italic/g, "font-bold"],
  [/font-black/g, "font-bold"],
  [/rounded-\[2\.5rem\]/g, "rounded-2xl"],
  [/rounded-\[2rem\]/g, "rounded-2xl"],
  [/rounded-\[1\.5rem\]/g, "rounded-xl"],
  [/rounded-\[1\.4rem\]/g, "rounded-xl"],
  [/backdrop-blur-3xl/g, ""],
  [/backdrop-blur-2xl/g, ""],
  [/backdrop-blur-xl/g, ""],
  [/backdrop-blur-md/g, ""],
  [/backdrop-blur-sm/g, ""],
  [/shadow-2xl/g, "shadow-sm"],
  [/shadow-xl/g, "shadow-sm"],
  [/grad-primary/g, "bg-primary text-primary-foreground"],
  [/glass-morphism/g, "surface-card"],
  [/border-white\/20/g, "border-border"],
  [/border-white\/10/g, "border-border"],
  [/border-white\/5/g, "border-border"],
  [/dark:border-white\/5/g, "border-border"],
  [/bg-white\/40/g, "bg-card"],
  [/bg-white\/50/g, "bg-card"],
  [/bg-white\/70/g, "bg-card"],
  [/bg-white\/90/g, "bg-card"],
];

function cleanClasses(classes) {
  let c = classes;
  for (const [pattern, replacement] of CLASS_REPLACEMENTS) {
    c = c.replace(pattern, replacement);
  }
  return c.replace(/\s+/g, " ").trim();
}

function transformSource(source) {
  let next = source.replace(/className="([^"]*)"/g, (_, classes) => {
    return `className="${cleanClasses(classes)}"`;
  });

  // cn("...", ...) and cn('...', ...)
  next = next.replace(/cn\(([^)]*)\)/gs, (match, inner) => {
    const updated = inner.replace(/"([^"]*)"/g, (_, classes) => `"${cleanClasses(classes)}"`)
      .replace(/'([^']*)'/g, (_, classes) => `'${cleanClasses(classes)}'`);
    return `cn(${updated})`;
  });

  return next;
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith(".tsx")) files.push(full);
  }
  return files;
}

let changed = 0;
for (const dir of TARGET_DIRS) {
  for (const file of walk(dir)) {
    const original = fs.readFileSync(file, "utf8");
    const next = transformSource(original);
    if (next !== original) {
      fs.writeFileSync(file, next);
      changed++;
    }
  }
}

console.log(`Safe ConextLab rebrand: updated ${changed} files.`);
