-- 003_ai_state: conversation state, ownership, storage mode, FK fix

-- Fix guest text conversation ids (002 used uuid FK incorrectly).
ALTER TABLE ai_messages
  DROP CONSTRAINT IF EXISTS ai_messages_conversation_id_fkey;

ALTER TABLE ai_messages
  ALTER COLUMN conversation_id TYPE text USING conversation_id::text;

ALTER TABLE ai_messages
  ADD CONSTRAINT ai_messages_conversation_id_fkey
  FOREIGN KEY (conversation_id) REFERENCES ai_conversations (id) ON DELETE CASCADE;

ALTER TABLE ai_conversations
  ADD COLUMN IF NOT EXISTS owner_session_id text,
  ADD COLUMN IF NOT EXISTS storage_mode text NOT NULL DEFAULT 'memory'
    CHECK (storage_mode IN ('postgres', 'memory')),
  ADD COLUMN IF NOT EXISTS schema_version integer NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS state jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS payload_hashes jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS ai_conversations_owner_idx
  ON ai_conversations (owner_session_id);

CREATE TABLE IF NOT EXISTS ai_turn_locks (
  conversation_id text PRIMARY KEY REFERENCES ai_conversations (id) ON DELETE CASCADE,
  client_request_id text NOT NULL,
  locked_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_knowledge (
  id text PRIMARY KEY,
  category text NOT NULL,
  title text NOT NULL,
  aliases text[] NOT NULL DEFAULT '{}',
  locale text NOT NULL DEFAULT 'en',
  body text NOT NULL,
  source_ref text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'published'
    CHECK (status IN ('published', 'draft')),
  reviewed_at timestamptz NOT NULL DEFAULT now(),
  search_tsv tsvector
);

CREATE INDEX IF NOT EXISTS ai_knowledge_tsv_idx ON ai_knowledge USING gin (search_tsv);
CREATE INDEX IF NOT EXISTS ai_knowledge_status_idx ON ai_knowledge (status);
