/** Verify continuous mercator matches dotted-map getPin (pre-snap). */
const X_MIN = -18701674.453269962;
const Y_MAX = 11361819.887676764;
const X_RANGE = 37403348.906539924;
const Y_RANGE = 18884783.128941886;
const MAP_W = 198;
const MAP_H = 100;
const R = 6378137;

function project(lat, lng) {
  const φ = (lat * Math.PI) / 180;
  const λ = (lng * Math.PI) / 180;
  const x = R * λ;
  const y = R * Math.log(Math.tan(Math.PI / 4 + φ / 2));
  const rawX = (MAP_W * (x - X_MIN)) / X_RANGE;
  const rawY = (MAP_H * (Y_MAX - y)) / Y_RANGE;
  return {
    rawX,
    rawY,
    viewBox: { x: (rawX / MAP_W) * 800, y: (rawY / MAP_H) * 400 },
  };
}

import DottedMap from "dotted-map";
const map = new DottedMap({ height: 100, grid: "diagonal" });

for (const [id, lat, lng] of [
  ["us", 40.7128, -74.006],
  ["jp", 35.6762, 139.6503],
  ["au", -33.8688, 151.2093],
  ["sg", 1.3521, 103.8198],
]) {
  const pin = map.getPin({ lat, lng });
  const cont = project(lat, lng);
  console.log(id, {
    snapped: { x: pin.x, y: pin.y },
    continuous: { x: cont.rawX, y: cont.rawY },
    viewBox: cont.viewBox,
  });
}
