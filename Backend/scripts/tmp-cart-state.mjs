import { loadEnvFile } from "../src/platform/loadEnvFile.ts";
import { loadConfig } from "../src/platform/config.ts";
import { createDb } from "../src/platform/db.ts";

loadEnvFile();
const db = createDb(loadConfig());
if (!db) {
  console.log("no-db");
  process.exit(0);
}
const rows = await db.query(
  `SELECT id, state->'lastDisplayedPlans' AS plans, state->>'lastAnswerTemplateId' AS template
   FROM ai_conversations ORDER BY updated_at DESC LIMIT 3`,
);
console.log(JSON.stringify(rows.rows, null, 2));
const id = rows.rows[0]?.id;
if (id) {
  const msgs = await db.query(
    `SELECT role, left(body, 90) AS body FROM ai_messages WHERE conversation_id = $1 ORDER BY created_at`,
    [id],
  );
  console.log(JSON.stringify(msgs.rows, null, 2));
}
await db.pool.end();
