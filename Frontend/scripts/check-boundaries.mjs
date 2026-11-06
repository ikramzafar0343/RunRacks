/**
 * check-boundaries — Enforces architectural boundaries according to Rule §3:
 * 1. src/shared/ must never import from features or app.
 * 2. src/features/<feature>/ must not import another feature's private files.
 *    Cross-feature imports must use the public contract (@/features/<target>).
 * Run via: npm run check:boundaries
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

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

const SHARED_ROOT = path.join(process.cwd(), "src", "shared");
const FEATURES_ROOT = path.join(process.cwd(), "src", "features");

const SHARED_FORBIDDEN_RE =
  /from\s+["'](@\/features(?:\/.*)?|@\/app(?:\/.*)?|\.\.\/features(?:\/.*)?|\.\.\/app(?:\/.*)?|(?:\.\.\/)+features(?:\/.*)?)["']/g;

const FEATURE_DEEP_IMPORT_RE =
  /from\s+["']@\/features\/([^/'"]+)\/([^'"]+)["']/g;

const violations = [];

// 1. Check src/shared
const sharedStat = await stat(SHARED_ROOT).catch(() => null);
if (sharedStat) {
  for (const file of await walk(SHARED_ROOT)) {
    const text = await readFile(file, "utf8");
    const matches = text.match(SHARED_FORBIDDEN_RE);
    if (matches) {
      violations.push({
        rule: "shared-cannot-import-features-or-app",
        file: path.relative(process.cwd(), file),
        hits: matches,
      });
    }
  }
}

// 2. Check src/features
const featuresStat = await stat(FEATURES_ROOT).catch(() => null);
if (featuresStat) {
  for (const file of await walk(FEATURES_ROOT)) {
    const relToFeatures = path.relative(FEATURES_ROOT, file);
    const currentFeature = relToFeatures.split(path.sep)[0];

    if (!currentFeature || currentFeature.endsWith(".ts")) continue;

    const text = await readFile(file, "utf8");
    let match;
    FEATURE_DEEP_IMPORT_RE.lastIndex = 0;
    while ((match = FEATURE_DEEP_IMPORT_RE.exec(text)) !== null) {
      const targetFeature = match[1];
      const subpath = match[2];
      if (targetFeature !== currentFeature) {
        violations.push({
          rule: "no-private-cross-feature-imports",
          file: path.relative(process.cwd(), file),
          hits: [`@/features/${targetFeature}/${subpath}`],
        });
      }
    }

    const RELATIVE_IMPORT_RE = /from\s+["'](\.\.[^'"]+)["']/g;
    const currentFeatureDir = path.join(FEATURES_ROOT, currentFeature);
    while ((match = RELATIVE_IMPORT_RE.exec(text)) !== null) {
      const relTarget = match[1];
      const resolved = path.resolve(path.dirname(file), relTarget);
      if (
        resolved.startsWith(FEATURES_ROOT) &&
        !resolved.startsWith(currentFeatureDir)
      ) {
        violations.push({
          rule: "no-cross-feature-relative-imports",
          file: path.relative(process.cwd(), file),
          hits: [relTarget],
        });
      }
    }
  }
}

if (violations.length > 0) {
  console.error(
    `check-boundaries FAILED — ${violations.length} boundary violation(s):`,
  );
  for (const v of violations) {
    console.error(`  [${v.rule}] ${v.file}: ${v.hits.join(", ")}`);
  }
  process.exit(1);
}

console.log("check-boundaries OK");
