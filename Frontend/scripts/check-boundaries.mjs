/**
 * check-boundaries — shared/ must not import features/ or app/.
 * Run via: npm run check:boundaries
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "src", "shared");
const IMPORT_RE =
  /from\s+["'](@\/features\/|@\/app\/|\.\.\/features\/|\.\.\/app\/)/g;

async function walk(dirPath) {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const rootStat = await stat(ROOT).catch(() => null);
if (!rootStat) {
  console.log("check-boundaries: no src/shared — skip");
  process.exit(0);
}

const violations = [];
for (const file of await walk(ROOT)) {
  const text = await readFile(file, "utf8");
  const matches = text.match(IMPORT_RE);
  if (matches) {
    violations.push({
      file: path.relative(process.cwd(), file),
      hits: matches,
    });
  }
}

if (violations.length > 0) {
  console.error("check-boundaries FAILED — shared imported feature/app:");
  for (const v of violations) {
    console.error(`  ${v.file}: ${v.hits.join(", ")}`);
  }
  process.exit(1);
}

console.log("check-boundaries OK");
