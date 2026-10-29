/**
 * POST /api/v1/contact — message intake seam
 *
 * Validates the body, then returns 503 NOT_CONFIGURED until real
 * mail/backend transport exists. Never returns { ok: true } without a send.
 */
import { NextResponse } from "next/server";
import type {
  ApiErrorBody,
  ApiSuccessBody,
  ContactAcceptedData,
  ContactRequest,
  ContactTopic,
} from "@/shared/lib/apiContracts";

const TOPICS = new Set<ContactTopic>([
  "engineers",
  "plans",
  "migration",
  "abuse",
  "other",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Partial<Record<keyof ContactRequest, string>>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validate(body: unknown):
  | { ok: true; data: ContactRequest }
  | { ok: false; fields: FieldErrors } {
  if (!isRecord(body)) {
    return {
      ok: false,
      fields: { message: "Request body must be a JSON object." },
    };
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const topicRaw = typeof body.topic === "string" ? body.topic : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  const fields: FieldErrors = {};

  if (name.length < 2 || name.length > 80) {
    fields.name = "Name must be 2–80 characters.";
  }
  if (!EMAIL_RE.test(email)) {
    fields.email = "Enter a valid email address.";
  }
  if (!TOPICS.has(topicRaw as ContactTopic)) {
    fields.topic = "Choose a valid topic.";
  }
  if (message.length < 20 || message.length > 4000) {
    fields.message = "Message must be 20–4000 characters.";
  }

  if (Object.keys(fields).length > 0) {
    return { ok: false, fields };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      topic: topicRaw as ContactTopic,
      message,
    },
  };
}

export async function POST(
  request: Request,
): Promise<NextResponse<ApiSuccessBody<ContactAcceptedData> | ApiErrorBody>> {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    const body: ApiErrorBody = {
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid JSON body.",
      },
    };
    return NextResponse.json(body, { status: 400 });
  }

  const parsed = validate(json);
  if (!parsed.ok) {
    const body: ApiErrorBody = {
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Fix the highlighted fields and try again.",
        details: { fields: parsed.fields },
      },
    };
    return NextResponse.json(body, { status: 400 });
  }

  // No mail transport env or send path exists yet — stay honest.
  void parsed.data;
  const body: ApiErrorBody = {
    ok: false,
    error: {
      code: "NOT_CONFIGURED",
      message:
        "Message intake isn’t connected yet. Use Pricing or RunRacks AI for now.",
    },
  };
  return NextResponse.json(body, { status: 503 });
}
