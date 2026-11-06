/**
 * Load SQL seeds from Database/seeds (regions + content stubs).
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { loadEnvFile } from "../src/platform/loadEnvFile.js";
import { loadConfig } from "../src/platform/config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  loadEnvFile();
  const cfg = loadConfig();
  if (!cfg.databaseUrl) {
    console.error("DATABASE_URL required");
    process.exit(1);
  }
  const client = new pg.Client({ connectionString: cfg.databaseUrl });
  await client.connect();
  const seedsDir = join(__dirname, "..", "..", "Database", "seeds");
  // content-stub includes AI knowledge blurbs (ai-blurb-*) for honest RAG.
  const files = ["regions-v1.sql", "content-stub-v1.sql"];
  try {
    for (const file of files) {
      const sql = readFileSync(join(seedsDir, file), "utf8");
      await client.query(sql);
      console.info(`seeded ${file}`);
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
