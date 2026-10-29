/**
 * Same-origin AI Advisor client — typed against apiContracts.
 */
import type {
  AiConfigData,
  AiMessageRequest,
  ApiErrorBody,
  ApiSuccessBody,
} from "@/shared/lib/apiContracts";

export async function fetchAiConfig(): Promise<AiConfigData> {
  const res = await fetch("/api/v1/ai/config", { method: "GET" });
  const body = (await res.json()) as ApiSuccessBody<AiConfigData> | ApiErrorBody;
  if (!res.ok || !body.ok) {
    const err = body as ApiErrorBody;
    throw new Error(err.error?.message || "Failed to load AI config.");
  }
  return body.data;
}

export type SendAiMessageResult =
  | { kind: "not_configured"; message: string }
  | { kind: "validation"; message: string }
  | { kind: "error"; message: string };

export async function sendAiMessage(
  conversationId: string,
  payload: AiMessageRequest,
): Promise<SendAiMessageResult> {
  const res = await fetch(
    `/api/v1/ai/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  let body: ApiErrorBody | ApiSuccessBody<unknown>;
  try {
    body = (await res.json()) as ApiErrorBody | ApiSuccessBody<unknown>;
  } catch {
    return { kind: "error", message: "Unexpected response from AI service." };
  }

  if (res.ok && body.ok) {
    return {
      kind: "error",
      message:
        "Unexpected success without AI transport. Please use Contact or Pricing.",
    };
  }

  const err = body as ApiErrorBody;
  const code = err.error?.code;
  const message =
    err.error?.message || "Something went wrong. Try Contact or Pricing.";

  if (code === "NOT_CONFIGURED" || code === "AI_DISABLED") {
    return { kind: "not_configured", message };
  }
  if (code === "VALIDATION_ERROR") {
    return { kind: "validation", message };
  }
  return { kind: "error", message };
}

export function createClientRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
