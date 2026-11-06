import DottedMap from "dotted-map";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(
  join(root, "src/components/ui/mapProjection.ts"),
  "utf8",
);
const num = (key) => Number(src.match(new RegExp(`${key}: ([0-9.-]+)`))[1]);

const mapWidth = num("mapWidth");
const mapHeight = num("mapHeight");
const xMin = num("xMin");
const yMax = num("yMax");
const xRange = num("xRange");
const yRange = num("yRange");
const R = 6378137;

function projectPoint(lat, lng) {
  const mercX = R * ((lng * Math.PI) / 180);
  const mercY = R * ((lat * Math.PI) / 180);
  const rawX = (mapWidth * (mercX - xMin)) / xRange;
  const rawY = (mapHeight * (yMax - mercY)) / yRange;
  return { x: (rawX / mapWidth) * 800, y: (rawY / mapHeight) * 400 };
}

const map = new DottedMap({
  height: 100,
  grid: "diagonal",
  projection: { name: "equirectangular" },
});

for (const [id, lat, lng] of [
  ["us", 38.9072, -77.0369],
  ["ca", 43.6532, -79.3832],
  ["gb", 51.5074, -0.1278],
]) {
  const pin = map.getPin({ lat, lng });
  const ours = projectPoint(lat, lng);
  const pinVb = { x: (pin.x / map.width) * 800, y: (pin.y / map.height) * 400 };
  console.log(id, {
    getPin: pinVb,
    ours,
    dx: ours.x - pinVb.x,
    dy: ours.y - pinVb.y,
  });
}
