/**
 * Live AI readiness — Backend /v1/ai/config.enabled (owned agent).
 */
import "server-only";
import { gateAiBackendProxy } from "@/server/aiBackendProxy";

export type AiProbeResult = {
  ready: boolean;
  detail: string;
};

export async function probeAiReady(timeoutMs = 4000): Promise<AiProbeResult> {
  const gate = await gateAiBackendProxy(timeoutMs);
  if (gate.ok) {
    return { ready: true, detail: "Backend owned AI enabled" };
  }
  return { ready: false, detail: gate.reason };
}
