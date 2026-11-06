-- 002_ai: conversations + messages for RunRacks AI Advisor

-- id is text so Frontend guest_* session ids and UUIDs both persist.
CREATE TABLE IF NOT EXISTS ai_conversations (
  id text PRIMARY KEY,
  locale text NOT NULL DEFAULT 'en',
  topic text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id uuid PRIMARY KEY,
  conversation_id text NOT NULL REFERENCES ai_conversations (id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  body text NOT NULL,
  client_request_id text,
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ai_messages_convo_client_req_uidx
  ON ai_messages (conversation_id, client_request_id)
  WHERE client_request_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ai_messages_convo_created_idx
  ON ai_messages (conversation_id, created_at);

CREATE TABLE IF NOT EXISTS ai_message_feedback (
  message_id uuid PRIMARY KEY REFERENCES ai_messages (id) ON DELETE CASCADE,
  rating text NOT NULL CHECK (rating IN ('up', 'down')),
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
