/**
 * Bounded setup/troubleshoot steps — no remote execution, no secrets.
 */
import type { ConversationStateV1 } from "../types/state.js";

export function nextDiagnosticStep(
  matching: string,
  state: ConversationStateV1,
): { text: string; stepId: string; state: ConversationStateV1 } {
  const next = { ...state, workflow: "troubleshooting" as const };
  const done = new Set(state.completedDiagnosticSteps);

  if (/ssh/i.test(matching) || state.osPreference === "linux") {
    if (!done.has("ssh_ip_port")) {
      next.completedDiagnosticSteps = [...done, "ssh_ip_port"];
      return {
        stepId: "ssh_ip_port",
        state: next,
        text: "First check: confirm the server IP and that your SSH port (often 22) is allowed from your IP. What exact error text do you see (redact secrets/keys)?",
      };
    }
    if (!done.has("ssh_auth")) {
      next.completedDiagnosticSteps = [...done, "ssh_auth"];
      return {
        stepId: "ssh_auth",
        state: next,
        text: "Next: verify the username and SSH key for that server. I can’t log in or reset credentials from chat — use Contact for account recovery.",
      };
    }
  }

  if (/rdp|remote desktop/i.test(matching) || state.workload === "remote_desktop") {
    if (!done.has("rdp_port")) {
      next.completedDiagnosticSteps = [...done, "rdp_port"];
      return {
        stepId: "rdp_port",
        state: next,
        text: "First check: confirm the public IP and that the RDP port is reachable. Avoid opening RDP to the whole internet. What error does Remote Desktop show?",
      };
    }
  }

  if (/dns|ssl|https/i.test(matching)) {
    if (!done.has("dns_a")) {
      next.completedDiagnosticSteps = [...done, "dns_a"];
      return {
        stepId: "dns_a",
        state: next,
        text: "Point the domain A record to the server IP, wait for DNS TTL, then retry HTTPS. If SSL still fails, say which panel you use — I won’t invent panel clicks.",
      };
    }
  }

  return {
    stepId: "generic",
    state: next,
    text: "I can walk through safe checks, but I can’t change your server or open a ticket from chat. Share the exact error (no secrets) or use Contact for account-specific help.",
  };
}
