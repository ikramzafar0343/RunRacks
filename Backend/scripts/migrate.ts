/**
 * Apply SQL migrations in order; ledger in schema_migrations.
 */
import { readFileSync, readdirSync } from "node:fs";
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
    console.error("DATABASE_URL is required to migrate");
    process.exit(1);
  }
  const client = new pg.Client({ connectionString: cfg.databaseUrl });
  await client.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    const dir = join(__dirname, "..", "migrations");
    const files = readdirSync(dir)
      .filter((f) => f.endsWith(".sql"))
      .sort();
    for (const file of files) {
      const id = file.replace(/\.sql$/, "");
      const exists = await client.query(
        "SELECT 1 FROM schema_migrations WHERE id = $1",
        [id],
      );
      if ((exists.rowCount ?? 0) > 0) {
        console.info(`skip ${id}`);
        continue;
      }
      const sql = readFileSync(join(dir, file), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          "INSERT INTO schema_migrations (id) VALUES ($1)",
          [id],
        );
        await client.query("COMMIT");
        console.info(`applied ${id}`);
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
