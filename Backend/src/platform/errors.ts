/**
 * RFC 9457-style problem details for API responses.
 */
export type ProblemCode =
  | "NOT_CONFIGURED"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "IDEMPOTENCY_CONFLICT"
  | "RATE_LIMITED"
  | "UPSTREAM_UNAVAILABLE"
  | "PROVIDER_UNAVAILABLE"
  | "UPSTREAM_TIMEOUT"
  | "INTERNAL_ERROR";

export type ProblemDetails = {
  type: string;
  title: string;
  status: number;
  code: ProblemCode;
  detail: string;
  instance?: string;
};

export function problem(
  status: number,
  code: ProblemCode,
  detail: string,
  title?: string,
): ProblemDetails {
  return {
    type: `https://runracks.com/problems/${code}`,
    title: title ?? code,
    status,
    code,
    detail,
  };
}

export function notConfigured(detail: string): ProblemDetails {
  return problem(503, "NOT_CONFIGURED", detail);
}
