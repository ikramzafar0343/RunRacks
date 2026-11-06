/**
 * PostgreSQL pool — parameterized queries only; release on every path.
 */
import pg from "pg";
import type { AppConfig } from "./config.js";

const { Pool } = pg;

export type Db = {
  pool: pg.Pool;
  query: <T extends pg.QueryResultRow = pg.QueryResultRow>(
    text: string,
    params?: unknown[],
  ) => Promise<pg.QueryResult<T>>;
  withClient: <T>(
    fn: (client: pg.PoolClient) => Promise<T>,
  ) => Promise<T>;
};

export function createDb(cfg: AppConfig): Db | null {
  if (!cfg.databaseUrl) return null;

  const pool = new Pool({
    connectionString: cfg.databaseUrl,
    max: cfg.dbPoolMax,
    statement_timeout: cfg.dbStatementTimeoutMs,
    lock_timeout: cfg.dbLockTimeoutMs,
    connectionTimeoutMillis: 5000,
  });

  return {
    pool,
    async query<T extends pg.QueryResultRow = pg.QueryResultRow>(
      text: string,
      params?: unknown[],
    ) {
      return pool.query<T>(text, params);
    },
    async withClient<T>(fn: (client: pg.PoolClient) => Promise<T>) {
      const client = await pool.connect();
      try {
        return await fn(client);
      } finally {
        client.release();
      }
    },
  };
}

export async function pingDb(db: Db): Promise<boolean> {
  const res = await db.query<{ ok: number }>("SELECT 1 AS ok");
  return res.rows[0]?.ok === 1;
}
