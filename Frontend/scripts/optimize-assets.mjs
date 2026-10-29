/**
 * optimize:assets — sharp + ttf2woff2 for slow-network delivery.
 * Idempotent: skips when fingerprint + settings already applied.
 * Rasters stay same path/extension so existing imports keep working.
 */
import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import ttf2woff2 from "ttf2woff2";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const FONTS_DIR = path.join(ROOT, "src", "styles", "fonts");
const MAX_EDGE = 1600;
const MIN_BYTES_TO_TOUCH = 40 * 1024;
const RASTER_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

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

function fingerprint(buf) {
  return createHash("sha1").update(buf).digest("hex").slice(0, 12);
}

async function optimizeRaster(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!RASTER_EXT.has(ext)) return null;

  const input = await readFile(filePath);
  if (input.byteLength < MIN_BYTES_TO_TOUCH) return null;

  const metaPath = `${filePath}.optmeta`;
  const fp = fingerprint(input);
  try {
    const prev = JSON.parse(await readFile(metaPath, "utf8"));
    if (prev.fp === fp && prev.maxEdge === MAX_EDGE) return null;
  } catch {
    // first optimize
  }

  const image = sharp(input, { failOn: "none" });
  const meta = await image.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const longEdge = Math.max(width, height);
  let pipeline = image.rotate();

  if (longEdge > MAX_EDGE) {
    pipeline = pipeline.resize({
      width: width >= height ? MAX_EDGE : undefined,
      height: height > width ? MAX_EDGE : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  let outBuf;
  if (ext === ".png") {
    outBuf = await pipeline
      .png({ compressionLevel: 9, palette: true })
      .toBuffer();
  } else if (ext === ".jpg" || ext === ".jpeg") {
    outBuf = await pipeline.jpeg({ quality: 78, mozjpeg: true }).toBuffer();
  } else {
    outBuf = await pipeline.webp({ quality: 78, effort: 4 }).toBuffer();
  }

  if (outBuf.byteLength >= input.byteLength * 0.98) {
    await writeFile(
      metaPath,
      JSON.stringify({ fp, maxEdge: MAX_EDGE, skipped: true }),
    );
    return null;
  }

  await writeFile(filePath, outBuf);
  await writeFile(
    metaPath,
    JSON.stringify({
      fp: fingerprint(outBuf),
      maxEdge: MAX_EDGE,
      inBytes: input.byteLength,
      outBytes: outBuf.byteLength,
    }),
  );

  return {
    path: path.relative(ROOT, filePath),
    saved: input.byteLength - outBuf.byteLength,
  };
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
    if (!name.endsWith(".ttf")) continue;
    if (name.includes("heavy")) continue;

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

async function main() {
  const rasters = (await walk(PUBLIC)).filter((f) =>
    RASTER_EXT.has(path.extname(f).toLowerCase()),
  );

  const imageResults = [];
  for (const file of rasters) {
    try {
      const result = await optimizeRaster(file);
      if (result) imageResults.push(result);
    } catch (err) {
      console.warn(`skip ${path.relative(ROOT, file)}:`, err.message);
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

  const saved =
    [...imageResults, ...fontResults].reduce((n, r) => n + (r.saved ?? 0), 0) /
    1024;

  console.log(
    `optimize:assets — ${imageResults.length} images, ${fontResults.length} fonts (~${saved.toFixed(0)} KiB saved)`,
  );
  for (const r of [...imageResults, ...fontResults]) {
    console.log(`  ${r.path} (−${(r.saved / 1024).toFixed(0)} KiB)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
