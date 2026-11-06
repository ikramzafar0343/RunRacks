import sharp from "sharp";

const src =
  "C:/Users/RunRacks-04/.cursor/projects/c-Users-RunRacks-04-Desktop-RunRacks/assets/composer-annotation-de5c22f0-d7d4-4238-8cc8-e142a25ff2f3.png";

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
console.log({ width, height });

let dMinX = Infinity;
let dMaxX = 0;
let dMinY = Infinity;
let dMaxY = 0;
let dn = 0;
for (let y = 0; y < height; y += 2) {
  for (let x = 0; x < width; x += 2) {
    const i = (y * width + x) * channels;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const isDot = g > 70 && g < 190 && g > r + 8 && g > b && r < 170;
    if (!isDot) continue;
    dn += 1;
    if (x < dMinX) dMinX = x;
    if (x > dMaxX) dMaxX = x;
    if (y < dMinY) dMinY = y;
    if (y > dMaxY) dMaxY = y;
  }
}
console.log("dots", { dn, dMinX, dMaxX, dMinY, dMaxY });

const blue = new Map();
for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const i = (y * width + x) * channels;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (b > 120 && b > r + 30 && b > g + 10) {
      const key = `${Math.floor(x / 30)}:${Math.floor(y / 30)}`;
      const bkt = blue.get(key) ?? { n: 0, sx: 0, sy: 0 };
      bkt.n += 1;
      bkt.sx += x;
      bkt.sy += y;
      blue.set(key, bkt);
    }
  }
}
for (const [k, bkt] of [...blue.entries()]
  .sort((a, b) => b[1].n - a[1].n)
  .slice(0, 12)) {
  console.log("blue", k, {
    n: bkt.n,
    cx: Math.round(bkt.sx / bkt.n),
    cy: Math.round(bkt.sy / bkt.n),
  });
}

const buckets = new Map();
for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const i = (y * width + x) * channels;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 200 && g < 60 && b < 60) {
      const key = `${Math.floor(x / 40)}`;
      const bkt = buckets.get(key) ?? {
        n: 0,
        sx: 0,
        sy: 0,
        minX: 9999,
        maxX: 0,
        minY: 9999,
        maxY: 0,
      };
      bkt.n += 1;
      bkt.sx += x;
      bkt.sy += y;
      bkt.minX = Math.min(bkt.minX, x);
      bkt.maxX = Math.max(bkt.maxX, x);
      bkt.minY = Math.min(bkt.minY, y);
      bkt.maxY = Math.max(bkt.maxY, y);
      buckets.set(key, bkt);
    }
  }
}
for (const [k, bkt] of [...buckets.entries()].sort(
  (a, b) => Number(a[0]) - Number(b[0]),
)) {
  if (bkt.n < 8) continue;
  console.log(k, {
    n: bkt.n,
    cx: Math.round(bkt.sx / bkt.n),
    cy: Math.round(bkt.sy / bkt.n),
    box: [bkt.minX, bkt.minY, bkt.maxX, bkt.maxY],
  });
}
