/**
 * Bake dotted-map WebPs so WorldMap never inlines ~1MB SVG data URLs in HTML.
 */
import {
  mkdirSync,
  writeFileSync,
  unlinkSync,
  existsSync,
  statSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import DottedMap from "dotted-map";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "images", "maps");

const variants = [
  { name: "dotted-world-light", color: "#34745A88" },
  { name: "dotted-world-dark", color: "#C8F13540" },
];

mkdirSync(outDir, { recursive: true });
const map = new DottedMap({ height: 100, grid: "diagonal" });

for (const { name, color } of variants) {
  const svg = map.getSVG({
    radius: 0.22,
    color,
    shape: "circle",
    backgroundColor: "transparent",
  });
  const webpPath = join(outDir, `${name}.webp`);
  const buf = await sharp(Buffer.from(svg), { density: 96 })
    .resize(1056, 495, {
      fit: "fill",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 55, alphaQuality: 60, effort: 6 })
    .toBuffer();
  writeFileSync(webpPath, buf);
  const svgPath = join(outDir, `${name}.svg`);
  if (existsSync(svgPath)) unlinkSync(svgPath);
  console.log(`${name}.webp ${statSync(webpPath).size} bytes`);
}
