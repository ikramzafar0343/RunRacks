/**
 * One-shot: optimize Admin RDP float-01..04 from .tmp-floats sources.
 */
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(ROOT, "..", ".tmp-floats");
const OUT_DIR = path.join(ROOT, "public", "images", "admin-rdp");
/** Float band tiles are ~200–400px tall; 1024 covers 2× retina cleanly. */
const MAX_EDGE = 1024;
const QUALITY = 80;

for (let i = 1; i <= 4; i++) {
  const name = `float-0${i}.jpg`;
  const src = path.join(SRC_DIR, `float-0${i}-src.jpg`);
  const dest = path.join(OUT_DIR, name);
  const input = await readFile(src);
  const inputMeta = await sharp(input).metadata();
  const buf = await sharp(input, { failOn: "none" })
    .rotate()
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({
      quality: QUALITY,
      mozjpeg: true,
      progressive: true,
      chromaSubsampling: "4:2:0",
    })
    .toBuffer();
  await writeFile(dest, buf);
  const outMeta = await sharp(buf).metadata();
  const fp = createHash("sha1").update(buf).digest("hex").slice(0, 12);
  await writeFile(
    `${dest}.optmeta`,
    `${JSON.stringify({
      fp,
      maxEdge: 1600,
      quality: QUALITY,
      floatOptimized: true,
    })}\n`,
  );
  console.log(
    name,
    `${inputMeta.width}x${inputMeta.height}`,
    `${Math.round(input.length / 1024)}KB ->`,
    `${outMeta.width}x${outMeta.height}`,
    `${Math.round(buf.length / 1024)}KB`,
  );
}
