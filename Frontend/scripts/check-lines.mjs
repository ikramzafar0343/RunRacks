/**
 * check:lines — enforces the repo rule: max 300 physical lines per authored file.
 *
 * Run via: npm run check:lines
 * Why: keeps modules small and reviewable (comments + blank lines count).
 *
 * Walks the Frontend project, skips build/vendor dirs, fails if any file > 300.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const MAX_LINES = 300;
const IGNORED_DIRS = new Set([
  ".git",
  ".next",
  "node_modules",
  "out",
  "build",
  "coverage",
  "public",
]);
const CHECKED_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".css",
  ".md",
  ".mdc",
  ".json",
]);
const IGNORED_FILES = new Set(["package-lock.json", "next-env.d.ts"]);

/** Recursively collect authored file paths under dirPath. */
async function walk(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".env.example") {
      if (IGNORED_DIRS.has(entry.name)) {
        continue;
      }
    }

    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) {
        continue;
      }
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (IGNORED_FILES.has(entry.name)) {
      continue;
    }

    const extension = path.extname(entry.name);
    if (!CHECKED_EXTENSIONS.has(extension)) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

/** Count physical lines (trailing newline does not add an extra line). */
function countPhysicalLines(contents) {
  if (contents.length === 0) {
    return 0;
  }

  const normalized = contents.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") {
    return lines.length - 1;
  }
  return lines.length;
}

const authoredFiles = await walk(ROOT);
const violations = [];

for (const filePath of authoredFiles) {
  const fileStat = await stat(filePath);
  if (!fileStat.isFile()) {
    continue;
  }

  const contents = await readFile(filePath, "utf8");
  const lineCount = countPhysicalLines(contents);
  if (lineCount > MAX_LINES) {
    violations.push({
      filePath: path.relative(ROOT, filePath),
      lineCount,
    });
  }
}

if (violations.length > 0) {
  console.error(`check:lines failed (max ${MAX_LINES} physical lines):`);
  for (const violation of violations) {
    console.error(`- ${violation.filePath}: ${violation.lineCount}`);
  }
  process.exit(1);
}

console.log(
  `check:lines passed (${authoredFiles.length} files, max ${MAX_LINES} lines)`,
);
