/**
 * optimize:assets — sharp + ttf2woff2 for slow-network (3G) delivery.
 * Idempotent via .optmeta fingerprints. Emits WebP siblings; prunes orphans.
 */
import { readdir, readFile, stat, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ttf2woff2 from "ttf2woff2";
import {
  RASTER_EXT,
  MASTER_EXT,
  optimizeRaster,
  emitWebpSibling,
  pruneIfWebpWins,
  deleteUnreferenced,
} from "./lib/optimize-raster.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const SRC = path.join(ROOT, "src");
const FONTS_DIR = path.join(ROOT, "src", "styles", "fonts");
const OUTLIER_BYTES = 100 * 1024;

const FORCE_UNREF = [
  path.join(PUBLIC, "images", "vps", "hero", "server-stack-transparent.png"),
];

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function loadSrcHaystack() {
  const files = (await walk(SRC)).filter((f) =>
    /\.(tsx?|jsx?|css|md|mjs|json)$/i.test(f),
  );
  const chunks = [];
  for (const f of files) {
    try {
      chunks.push(await readFile(f, "utf8"));
    } catch {
      // skip
    }
  }
  return chunks.join("\n");
}

async function convertFonts() {
  const results = [];
  let files;
  try {
    files = await readdir(FONTS_DIR);
  } catch {
    return results;
  }

  for (const name of files) {
    if (!name.endsWith(".ttf") || name.includes("heavy")) continue;
    const ttfPath = path.join(FONTS_DIR, name);
    const woff2Path = ttfPath.replace(/\.ttf$/i, ".woff2");
    const ttf = await readFile(ttfPath);
    try {
      const existing = await readFile(woff2Path);
      const tStat = await stat(ttfPath);
      const wStat = await stat(woff2Path);
      if (wStat.mtimeMs >= tStat.mtimeMs && existing.byteLength > 0) continue;
    } catch {
      // convert
    }
    const woff2 = ttf2woff2(ttf);
    await writeFile(woff2Path, Buffer.from(woff2));
    results.push({
      path: path.relative(ROOT, woff2Path),
      saved: ttf.byteLength - woff2.length,
    });
  }
  return results;
}

async function reportOutliers(rasters) {
  const big = [];
  for (const file of rasters) {
    try {
      const st = await stat(file);
      if (st.size > OUTLIER_BYTES) {
        big.push({
          path: path.relative(ROOT, file),
          kb: Math.round(st.size / 1024),
        });
      }
    } catch {
      // gone
    }
  }
  big.sort((a, b) => b.kb - a.kb);
  if (big.length) {
    console.log(`outliers >100 KiB (${big.length}):`);
    for (const b of big.slice(0, 25)) {
      console.log(`  ${b.path} (${b.kb} KiB)`);
    }
  }
}

async function main() {
  const srcHaystack = await loadSrcHaystack();
  const allPublic = await walk(PUBLIC);
  const rasters = allPublic.filter((f) =>
    RASTER_EXT.has(path.extname(f).toLowerCase()),
  );

  const imageResults = [];
  for (const file of rasters) {
    try {
      const result = await optimizeRaster(file, ROOT);
      if (result) imageResults.push(result);
    } catch (err) {
      console.warn(`skip ${path.relative(ROOT, file)}:`, err.message);
    }
  }

  const webpResults = [];
  const masters = rasters.filter((f) =>
    MASTER_EXT.has(path.extname(f).toLowerCase()),
  );
  for (const file of masters) {
    try {
      const result = await emitWebpSibling(file, ROOT);
      if (result) webpResults.push(result);
    } catch (err) {
      console.warn(`webp ${path.relative(ROOT, file)}:`, err.message);
    }
  }

  const pruneResults = [];
  for (const file of FORCE_UNREF) {
    try {
      const result = await deleteUnreferenced(file, ROOT, srcHaystack);
      if (result) pruneResults.push(result);
    } catch (err) {
      console.warn(`unref ${path.relative(ROOT, file)}:`, err.message);
    }
  }

  const mastersAgain = (await walk(PUBLIC)).filter((f) =>
    MASTER_EXT.has(path.extname(f).toLowerCase()),
  );
  for (const file of mastersAgain) {
    try {
      const result = await pruneIfWebpWins(file, ROOT, srcHaystack);
      if (result) pruneResults.push(result);
    } catch (err) {
      console.warn(`prune ${path.relative(ROOT, file)}:`, err.message);
    }
  }

  const fontResults = await convertFonts();

  const heroPng = path.join(PUBLIC, "home", "hero-portrait.png");
  const heroWebp = path.join(PUBLIC, "home", "hero-portrait.webp");
  try {
    await stat(heroWebp);
    await unlink(heroPng);
    console.log("removed public/home/hero-portrait.png (webp in use)");
  } catch {
    // keep if webp missing
  }

  const all = [
    ...imageResults,
    ...webpResults,
    ...pruneResults,
    ...fontResults,
  ];
  const saved = all.reduce((n, r) => n + (r.saved ?? 0), 0) / 1024;

  console.log(
    `optimize:assets — ${imageResults.length} recompress, ${webpResults.length} webp, ${pruneResults.length} pruned, ${fontResults.length} fonts (~${saved.toFixed(0)} KiB saved)`,
  );
  for (const r of all) {
    const tag = r.kind ? ` [${r.kind}]` : "";
    console.log(`  ${r.path}${tag} (−${(r.saved / 1024).toFixed(0)} KiB)`);
  }

  await reportOutliers(
    await walk(PUBLIC).then((files) =>
      files.filter((f) => RASTER_EXT.has(path.extname(f).toLowerCase())),
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
