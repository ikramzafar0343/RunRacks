import { loadEnvFile } from "../platform/loadEnvFile.js";
import { loadConfig } from "../platform/config.js";
import { createDb } from "../platform/db.js";
import { createWhmcsClient } from "../features/whmcs/whmcsClient.js";
import { logError, logInfo } from "../platform/logging.js";
import { buildApp } from "./buildApp.js";
import type { AppContext } from "./context.js";

async function main() {
  loadEnvFile();
  const config = loadConfig();
  const db = createDb(config);
  const whmcs = createWhmcsClient(config);
  const ctx: AppContext = { config, db, whmcs };
  const app = await buildApp(ctx);

  try {
    await app.listen({ host: config.host, port: config.port });
    logInfo("backend_listening", {
      host: config.host,
      port: config.port,
      database: Boolean(db),
      whmcs: whmcs.configured,
    });
  } catch (err) {
    logError("backend_listen_failed", { err: String(err) });
    process.exit(1);
  }
}

main();
