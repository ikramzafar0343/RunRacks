/**
 * Resolve pack assets from src (tsx) or Backend cwd (dist).
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));

export function resolvePackFile(name: string): string {
  const candidates = [
    join(HERE, name),
    join(process.cwd(), "src", "features", "ai", "pack", name),
    join(process.cwd(), "Backend", "src", "features", "ai", "pack", name),
  ];
  for (const path of candidates) {
    if (existsSync(path)) return path;
  }
  throw new Error(`AI pack file missing: ${name}`);
}
