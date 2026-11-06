import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["src", "scripts", "migrations"];
const max = 300;
let failed = false;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      walk(p);
      continue;
    }
    if (!/\.(ts|js|mjs|sql)$/.test(name)) continue;
    const lines = readFileSync(p, "utf8").split(/\r?\n/).length;
    if (lines > max) {
      console.error(`${p}: ${lines} lines (max ${max})`);
      failed = true;
    }
  }
}

for (const r of roots) {
  try {
    walk(r);
  } catch {
    /* missing root ok */
  }
}
process.exit(failed ? 1 : 0);
