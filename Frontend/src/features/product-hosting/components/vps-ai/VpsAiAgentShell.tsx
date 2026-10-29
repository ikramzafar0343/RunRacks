import type { ReactNode } from "react";

export function VpsAiAgentShell({ children }: { children: ReactNode }) {
  return (
    <div className="vpsAiAgent" aria-hidden>
      <div className="vpsAiAgentHeader">
        <svg
          className="vpsAiAgentSparkle"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 1.2 9.1 5.4 13.4 6.5 9.1 7.6 8 11.8 6.9 7.6 2.6 6.5 6.9 5.4Z" />
        </svg>
        Agent
      </div>

      <div className="vpsAiAgentMessages">{children}</div>

      <div className="vpsAiAgentInput" aria-hidden>
        <svg
          className="vpsAiAgentInputPlus"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M8 3v10M3 8h10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <span className="vpsAiAgentInputFake">Ask anything…</span>
        <span className="vpsAiAgentSend" aria-hidden>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 12.5V3.5M4.5 7 8 3.5 11.5 7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
