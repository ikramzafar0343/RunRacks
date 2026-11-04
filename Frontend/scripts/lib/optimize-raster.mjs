/**
 * Sharp helpers for optimize-assets — resize, re-encode, WebP siblings, prune.
 */
import { createHash } from "node:crypto";
import { readFile, writeFile, unlink, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const MAX_EDGE = 1600;
export const MIN_BYTES_TO_TOUCH = 40 * 1024;
export const WEBP_QUALITY = 80;
export const JPEG_QUALITY = 78;
export const RASTER_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);
export const MASTER_EXT = new Set([".png", ".jpg", ".jpeg"]);

export function fingerprint(buf) {
  return createHash("sha1").update(buf).digest("hex").slice(0, 12);
}

function resizeIfNeeded(pipeline, width, height) {
  const longEdge = Math.max(width, height);
  if (longEdge <= MAX_EDGE) return pipeline;
  return pipeline.resize({
    width: width >= height ? MAX_EDGE : undefined,
    height: height > width ? MAX_EDGE : undefined,
    fit: "inside",
    withoutEnlargement: true,
  });
}

async function encodeSameFormat(pipeline, ext) {
  if (ext === ".png") {
    return pipeline.png({ compressionLevel: 9, palette: true }).toBuffer();
  }
  if (ext === ".jpg" || ext === ".jpeg") {
    return pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
  }
  return pipeline.webp({ quality: JPEG_QUALITY, effort: 4 }).toBuffer();
}

/** In-place optimize; returns { path, saved } or null. */
export async function optimizeRaster(filePath, root) {
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
  const pipeline = resizeIfNeeded(image.rotate(), width, height);
  const outBuf = await encodeSameFormat(pipeline, ext);

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
    path: path.relative(root, filePath),
    saved: input.byteLength - outBuf.byteLength,
  };
}

/** Write sibling .webp when ≥15% smaller than master. */
export async function emitWebpSibling(filePath, root) {
  const ext = path.extname(filePath).toLowerCase();
  if (!MASTER_EXT.has(ext)) return null;

  const input = await readFile(filePath);
  if (input.byteLength < MIN_BYTES_TO_TOUCH) return null;

  const webpPath = filePath.replace(/\.(png|jpe?g)$/i, ".webp");
  const image = sharp(input, { failOn: "none" });
  const meta = await image.metadata();
  const pipeline = resizeIfNeeded(
    image.rotate(),
    meta.width ?? 0,
    meta.height ?? 0,
  );
  const webpBuf = await pipeline
    .webp({ quality: WEBP_QUALITY, effort: 5 })
    .toBuffer();

  if (webpBuf.byteLength > input.byteLength * 0.85) return null;

  let existing = null;
  try {
    existing = await readFile(webpPath);
  } catch {
    // create
  }
  if (existing && existing.byteLength <= webpBuf.byteLength) return null;

  await writeFile(webpPath, webpBuf);
  return {
    path: path.relative(root, webpPath),
    saved: input.byteLength - webpBuf.byteLength,
    kind: "webp-sibling",
  };
}

/** Delete master when smaller WebP sibling exists and master is unreferenced in src. */
export async function pruneIfWebpWins(filePath, root, srcHaystack) {
  const ext = path.extname(filePath).toLowerCase();
  if (!MASTER_EXT.has(ext)) return null;

  const webpPath = filePath.replace(/\.(png|jpe?g)$/i, ".webp");
  let webpStat;
  let masterStat;
  try {
    webpStat = await stat(webpPath);
    masterStat = await stat(filePath);
  } catch {
    return null;
  }
  if (webpStat.size >= masterStat.size) return null;

  const publicRel = path
    .relative(path.join(root, "public"), filePath)
    .split(path.sep)
    .join("/");
  const needle = `/${publicRel}`.replace(/\\/g, "/");
  if (srcHaystack.includes(needle) || srcHaystack.includes(publicRel)) {
    return null;
  }

  const saved = masterStat.size;
  await unlink(filePath);
  try {
    await unlink(`${filePath}.optmeta`);
  } catch {
    // none
  }
  return { path: path.relative(root, filePath), saved, kind: "pruned" };
}

export async function deleteUnreferenced(filePath, root, srcHaystack) {
  const publicRel = path
    .relative(path.join(root, "public"), filePath)
    .split(path.sep)
    .join("/");
  const needle = `/${publicRel}`;
  if (srcHaystack.includes(needle) || srcHaystack.includes(publicRel)) {
    return null;
  }
  try {
    const st = await stat(filePath);
    await unlink(filePath);
    try {
      await unlink(`${filePath}.optmeta`);
    } catch {
      // none
    }
    return { path: path.relative(root, filePath), saved: st.size, kind: "unref" };
  } catch {
    return null;
  }
}
