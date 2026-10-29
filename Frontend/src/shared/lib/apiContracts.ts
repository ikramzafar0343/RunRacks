/**
 * Shared API response shapes (contracts).
 *
 * Why:
 * - Route Handlers and future clients agree on one JSON shape.
 * - Discriminated unions: check `ok` then TypeScript narrows success vs error.
 *
 * Pattern used everywhere:
 *   success → { ok: true, data: ... }
 *   failure → { ok: false, error: { code, message, details? } }
 */

/** Machine-readable error codes (stable for clients; message can change). */
export type ApiErrorCode =
  | "NOT_CONFIGURED"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"
  | "AI_DISABLED"
  | "PROVIDER_UNAVAILABLE"
  | "OUTPUT_VALIDATION_FAILED"
  | "UPSTREAM_TIMEOUT";

export type ApiErrorBody = {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
};

/** Generic success wrapper — TData is the payload for a specific endpoint. */
export type ApiSuccessBody<TData> = {
  ok: true;
  data: TData;
};

export type ApiResponse<TData> = ApiSuccessBody<TData> | ApiErrorBody;

/** Payload for GET /api/health */
export type HealthData = {
  service: "frontend";
  status: "ok";
  timestamp: string;
};

/** Payload when GET /api/v1/ready succeeds (both integrations configured). */
export type ReadyData = {
  service: "frontend";
  status: "ready";
  backendConfigured: true;
  databaseConfigured: true;
  timestamp: string;
};

/** Extra detail nested under error.details when readiness fails. */
export type ReadyBlockedData = {
  service: "frontend";
  status: "not_ready";
  backendConfigured: boolean;
  databaseConfigured: boolean;
  timestamp: string;
};

/** Contact form topics — keep in sync with contactContent CONTACT_TOPICS. */
export type ContactTopic =
  | "engineers"
  | "plans"
  | "migration"
  | "abuse"
  | "other";

/** Body for POST /api/v1/contact */
export type ContactRequest = {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
};

/**
 * Success payload only after real mail/backend transport succeeds.
 * Do not return this until send is implemented and verified.
 */
export type ContactAcceptedData = {
  accepted: true;
  timestamp: string;
};

/** Allowlisted /ai?topic= values — seed chips only, never auto-send. */
export type AiTopic = "vps" | "windows" | "pricing" | "contact";

export type AiStarterPrompt = {
  id: string;
  label: string;
  prompt: string;
  topic: AiTopic | "setup";
};

export type AiConfigStatus = "not_configured" | "ready";

/** GET /api/v1/ai/config */
export type AiConfigData = {
  status: AiConfigStatus;
  enabled: boolean;
  maxInputChars: number;
  topics: readonly AiTopic[];
  starters: readonly AiStarterPrompt[];
  disclaimer: string;
  supportHref: "/contact";
  timestamp: string;
};

/** POST /api/v1/ai/conversations/:id/messages body */
export type AiMessageRequest = {
  clientRequestId: string;
  message: string;
  locale?: string;
  context?: {
    topic?: AiTopic | "setup";
  };
};

/** Reserved SSE event names for future Backend streaming. */
export type AiStreamEventType =
  | "message.accepted"
  | "response.delta"
  | "response.block"
  | "response.complete"
  | "error";

export type AiStreamEvent = {
  type: AiStreamEventType;
  data: Record<string, unknown>;
};

/** Typed answer blocks — Backend validates before render. */
export type AiUiBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; language?: string; text: string }
  | { type: "notice"; text: string }
  | {
      type: "actionLinks";
      links: { label: string; href: string }[];
    }
  | { type: "handoffPrompt"; text: string };

/** Admin AI settings DTO — contract only until admin app exists. */
export type AiAdminSettingsData = {
  enabled: boolean;
  allowedTools: string[];
  retentionDays: number;
  quotas: Record<string, number>;
};
