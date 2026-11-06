/**
 * Smoke: primary writable, replica in recovery, lag measurable.
 * Usage: node scripts/check-replica.mjs
 */
import pg from "pg";

const primaryUrl =
  process.env.DATABASE_URL ??
  "postgresql://runracks_admin:runracks_admin_dev@127.0.0.1:5432/runracks";
const replicaUrl =
  process.env.DATABASE_REPLICA_URL ??
  "postgresql://runracks_admin:runracks_admin_dev@127.0.0.1:5433/runracks";

async function main() {
  const primary = new pg.Client({ connectionString: primaryUrl });
  const replica = new pg.Client({ connectionString: replicaUrl });
  await primary.connect();
  await replica.connect();

  const p = await primary.query("SELECT pg_is_in_recovery() AS recovery");
  if (p.rows[0].recovery) {
    throw new Error("primary reports pg_is_in_recovery=true");
  }

  const r = await replica.query("SELECT pg_is_in_recovery() AS recovery");
  if (!r.rows[0].recovery) {
    throw new Error("replica is not in recovery");
  }

  const lag = await replica.query(`
    SELECT CASE
      WHEN pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn() THEN 0
      ELSE EXTRACT(EPOCH FROM now() - pg_last_xact_replay_timestamp())
    END AS lag_seconds
  `);
  const lagSeconds = Number(lag.rows[0].lag_seconds ?? 0);
  console.log(
    JSON.stringify({
      ok: true,
      primaryRecovery: false,
      replicaRecovery: true,
      lagSeconds,
    }),
  );

  await primary.end();
  await replica.end();
}

main().catch((err) => {
  console.error(String(err));
  process.exit(1);
});
