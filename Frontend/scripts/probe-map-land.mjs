import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const imgPath = join(root, "public/images/maps/dotted-world-light.webp");
const outPath = join(root, "pin-debug.webp");
const hubs = {
  us: [175, 122],
  ca: [162, 90],
  gb: [395, 62],
  nl: [408, 66],
  de: [424, 74],
  sg: [652, 210],
  au: [730, 310],
  jp: [694, 96],
};
const width = 1056;
const height = 528;
const circles = Object.entries(hubs)
  .map(([id, [mx, my]]) => {
    const cx = ((mx / 800) * width).toFixed(1);
    const cy = ((my / 400) * height).toFixed(1);
    return `<circle cx="${cx}" cy="${cy}" r="8" fill="#e11d48"/><text x="${Number(cx) + 10}" y="${cy}" font-size="16" fill="#fff" font-family="sans-serif">${id}</text>`;
  })
  .join("");
await sharp(imgPath)
  .composite([
    {
      input: Buffer.from(
        `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${circles}</svg>`,
      ),
    },
  ])
  .webp({ quality: 82 })
  .toFile(outPath);
console.log(outPath);
