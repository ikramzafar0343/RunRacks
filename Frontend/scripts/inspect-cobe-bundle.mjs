import fs from "node:fs";

const p = ".next/dev/static/chunks/node_modules_07-qrf5cuqrwg._.js";
const s = fs.readFileSync(p, "utf8");
console.log(
  "bundled has patch",
  s.includes("preserveDrawingBuffer:!1})||r.getContext"),
);
console.log("bundled has old probe", s.includes('getContext("webgl")?"webgl"'));
const i = s.indexOf("getContext");
console.log(s.slice(i, i + 300));

const phen = s.indexOf("DEPTH_TEST");
console.log("DEPTH_TEST context", s.slice(phen - 80, phen + 80));
