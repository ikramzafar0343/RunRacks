-- Dev roles: migrator (DDL) vs least-privilege app (DML).
-- Production: create equivalents outside Compose with rotated passwords.

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'runracks_migrator') THEN
    CREATE ROLE runracks_migrator LOGIN PASSWORD 'runracks_migrator_dev';
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'runracks_app') THEN
    CREATE ROLE runracks_app LOGIN PASSWORD 'runracks_app_dev';
  END IF;
END
$$;

GRANT CONNECT ON DATABASE runracks TO runracks_migrator, runracks_app;
GRANT ALL ON SCHEMA public TO runracks_migrator;
GRANT USAGE ON SCHEMA public TO runracks_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO runracks_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO runracks_app;
