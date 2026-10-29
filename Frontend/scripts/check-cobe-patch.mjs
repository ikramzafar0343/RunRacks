import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const esm = fs.readFileSync(
  path.resolve("node_modules/cobe/dist/index.esm.js"),
  "utf8",
);
console.log(
  "node_modules patched:",
  esm.includes("preserveDrawingBuffer:!1})||r.getContext"),
);

try {
  const out = execSync('rg -l "preserveDrawingBuffer:!1[}][)][|][|]" .next', {
    encoding: "utf8",
  });
  console.log("in .next:\n" + out);
} catch {
  console.log("patched string NOT found in .next (Turbopack may be stale)");
}

try {
  const out2 = execSync(
    'rg -l "getContext\\(\\"webgl\\"\\)\\?\\"webgl\\"" .next/dev',
    { encoding: "utf8" },
  );
  console.log("old probe still in .next:\n" + out2);
} catch {
  console.log("old probe not found in .next/dev (good or no match)");
}
