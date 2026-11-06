/**
 * Same-origin AI Advisor client — SSE with abort + store mode.
 */
import type {
  AiConfigData,
  AiMessageRequest,
  AiStreamEventType,
  ApiErrorBody,
  ApiSuccessBody,
} from "@/shared/lib/apiContracts";

export async function fetchAiConfig(): Promise<AiConfigData> {
  const res = await fetch("/api/v1/ai/config", { method: "GET" });
  const body = (await res.json()) as
    ApiSuccessBody<AiConfigData> | ApiErrorBody;
  if (!res.ok || !body.ok) {
    const err = body as ApiErrorBody;
    throw new Error(err.error?.message || "Failed to load AI config.");
  }
  return body.data;
}

export type SendAiMessageResult =
  | {
      kind: "ok";
      text: string;
      messageId?: string;
      conversationId?: string;
      store?: "postgres" | "memory";
    }
  | { kind: "not_configured"; message: string }
  | { kind: "validation"; message: string }
  | { kind: "error"; message: string }
  | { kind: "aborted" };

export type StreamHandlers = {
  onDelta?: (text: string) => void;
  onBlock?: (block: Record<string, unknown>) => void;
  onComplete?: (payload: {
    text: string;
    messageId?: string;
    conversationId?: string;
    store?: "postgres" | "memory";
  }) => void;
};

/** Exported for seam tests — robust CRLF / multi-data frame parse. */
export function parseSseChunk(
  chunk: string,
): { event: AiStreamEventType | string; data: Record<string, unknown> } | null {
  const lines = chunk.replace(/\r\n/g, "\n").split("\n");
  let event: string | null = null;
  const dataLines: string[] = [];
  for (const line of lines) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
  }
  if (!event || dataLines.length === 0) return null;
  try {
    return {
      event,
      data: JSON.parse(dataLines.join("\n")) as Record<string, unknown>,
    };
  } catch {
    return null;
  }
}

export async function sendAiMessage(
  conversationId: string,
  payload: AiMessageRequest,
  handlers: StreamHandlers = {},
  signal?: AbortSignal,
): Promise<SendAiMessageResult> {
  let res: Response;
  try {
    res = await fetch(
      `/api/v1/ai/conversations/${encodeURIComponent(conversationId)}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream, application/json",
        },
        body: JSON.stringify(payload),
        ...(signal ? { signal } : {}),
      },
    );
  } catch (err) {
    if (signal?.aborted) return { kind: "aborted" };
    return { kind: "error", message: String(err) };
  }

  const contentType = res.headers.get("Content-Type") ?? "";

  if (!contentType.includes("text/event-stream")) {
    let body: ApiErrorBody | ApiSuccessBody<unknown>;
    try {
      body = (await res.json()) as ApiErrorBody | ApiSuccessBody<unknown>;
    } catch {
      return { kind: "error", message: "Unexpected response from AI service." };
    }
    if (!body.ok) {
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
    return {
      kind: "error",
      message: "Expected a streaming AI response. Try again or use Contact.",
    };
  }

  if (!res.ok || !res.body) {
    return { kind: "error", message: "AI stream failed to open." };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let assembled = "";
  let messageId: string | undefined;
  let convoId: string | undefined;
  let store: "postgres" | "memory" | undefined;
  let errorMessage: string | null = null;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split(/\n\n/);
      buffer = parts.pop() ?? "";
      for (const part of parts) {
        const parsed = parseSseChunk(part.trim());
        if (!parsed) continue;
        if (parsed.event === "response.delta") {
          const text =
            typeof parsed.data.text === "string" ? parsed.data.text : "";
          if (text) {
            assembled += text;
            handlers.onDelta?.(text);
          }
        } else if (parsed.event === "response.block") {
          const block = parsed.data.block;
          if (block && typeof block === "object") {
            handlers.onBlock?.(block as Record<string, unknown>);
          }
        } else if (parsed.event === "response.complete") {
          const text =
            typeof parsed.data.text === "string" ? parsed.data.text : assembled;
          assembled = text;
          if (typeof parsed.data.messageId === "string") {
            messageId = parsed.data.messageId;
          }
          if (typeof parsed.data.conversationId === "string") {
            convoId = parsed.data.conversationId;
          }
          if (
            parsed.data.store === "postgres" ||
            parsed.data.store === "memory"
          ) {
            store = parsed.data.store;
          }
          handlers.onComplete?.({
            text: assembled,
            ...(messageId ? { messageId } : {}),
            ...(convoId ? { conversationId: convoId } : {}),
            ...(store ? { store } : {}),
          });
        } else if (parsed.event === "error") {
          errorMessage =
            typeof parsed.data.message === "string"
              ? parsed.data.message
              : "AI provider error";
        }
      }
    }
  } catch (err) {
    if (signal?.aborted) return { kind: "aborted" };
    return { kind: "error", message: String(err) };
  }

  if (errorMessage) return { kind: "error", message: errorMessage };
  if (!assembled) {
    return {
      kind: "error",
      message: "Empty AI response. Try Contact or Pricing.",
    };
  }
  return {
    kind: "ok",
    text: assembled,
    ...(messageId ? { messageId } : {}),
    ...(convoId ? { conversationId: convoId } : {}),
    ...(store ? { store } : {}),
  };
}

export function createClientRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
