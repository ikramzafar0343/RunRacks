import type { AppConfig } from "../platform/config.js";
import type { Db } from "../platform/db.js";
import type { WhmcsClient } from "../features/whmcs/whmcsClient.js";

export type AppContext = {
  config: AppConfig;
  db: Db | null;
  whmcs: WhmcsClient;
};
