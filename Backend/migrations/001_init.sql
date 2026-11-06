-- 001_init: ledger + core tables (WHMCS ids as external SoR keys)

CREATE TABLE IF NOT EXISTS schema_migrations (
  id text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS catalog_products (
  id bigserial PRIMARY KEY,
  whmcs_product_id integer NOT NULL UNIQUE,
  family text NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  pay_type text NOT NULL DEFAULT 'recurring',
  raw_checksum text NOT NULL DEFAULT '',
  synced_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS catalog_prices (
  id bigserial PRIMARY KEY,
  product_id bigint NOT NULL REFERENCES catalog_products (id) ON DELETE CASCADE,
  currency text NOT NULL,
  cycle text NOT NULL,
  amount_minor integer NOT NULL CHECK (amount_minor >= 0),
  UNIQUE (product_id, currency, cycle)
);

CREATE TABLE IF NOT EXISTS region_meta (
  id text PRIMARY KEY,
  label text NOT NULL,
  country_code text NOT NULL,
  group_id text NOT NULL,
  whmcs_config_option text
);

CREATE TABLE IF NOT EXISTS content_sections (
  id text PRIMARY KEY,
  title text NOT NULL,
  body jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_inquiries (
  id bigserial PRIMARY KEY,
  idempotency_key text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  topic text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (idempotency_key)
);

CREATE TABLE IF NOT EXISTS customers_cache (
  whmcs_client_id integer PRIMARY KEY,
  email text NOT NULL,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Active',
  synced_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services_cache (
  whmcs_service_id integer PRIMARY KEY,
  whmcs_client_id integer NOT NULL REFERENCES customers_cache (whmcs_client_id),
  whmcs_product_id integer,
  domain text NOT NULL DEFAULT '',
  status text NOT NULL,
  synced_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS services_cache_client_idx
  ON services_cache (whmcs_client_id);

CREATE TABLE IF NOT EXISTS cart_intents (
  id uuid PRIMARY KEY,
  whmcs_client_id integer,
  idempotency_key text NOT NULL,
  fingerprint text NOT NULL,
  currency text NOT NULL,
  lines jsonb NOT NULL,
  total_minor integer NOT NULL CHECK (total_minor >= 0),
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (idempotency_key)
);

CREATE TABLE IF NOT EXISTS payment_operations (
  id uuid PRIMARY KEY,
  whmcs_client_id integer NOT NULL,
  idempotency_key text NOT NULL,
  fingerprint text NOT NULL,
  status text NOT NULL,
  whmcs_order_id integer,
  whmcs_invoice_id integer,
  amount_minor integer NOT NULL CHECK (amount_minor >= 0),
  currency text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (idempotency_key)
);

CREATE TABLE IF NOT EXISTS idempotency_keys (
  scope text NOT NULL,
  key_digest text NOT NULL,
  fingerprint text NOT NULL,
  status text NOT NULL,
  result jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (scope, key_digest)
);
