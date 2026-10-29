"use client";

/**
 * Floating Agent — user bubble → typing dots → typewriter reply.
 * Animation FSM uses timeouts; parent remounts on sceneKey when needed.
 */
import { useEffect, useMemo, useState } from "react";
import type { AgentMessage } from "./vpsAiData";
import { startForIndex, type Phase } from "./vpsAiAgentPhase";
import { VpsAiAgentShell } from "./VpsAiAgentShell";

type VpsAiAgentPanelProps = {
  messages: readonly AgentMessage[];
  confirmPrompt?: string;
  sceneKey: string;
  instant?: boolean;
};

function initialPhase(
  messages: readonly AgentMessage[],
  confirmPrompt: string | undefined,
  instant: boolean,
): Phase {
  if (instant) {
    return confirmPrompt
      ? { kind: "confirm", chars: confirmPrompt.length }
      : { kind: "done" };
  }
  return startForIndex(messages, 0, confirmPrompt);
}

export function VpsAiAgentPanel({
  messages,
  confirmPrompt,
  sceneKey,
  instant = false,
}: VpsAiAgentPanelProps) {
  const signature = useMemo(
    () =>
      `${messages.map((m) => `${m.from}:${m.text}`).join("|")}::${confirmPrompt ?? ""}`,
    [messages, confirmPrompt],
  );

  const [settledCount, setSettledCount] = useState(0);
  const [boundScene, setBoundScene] = useState(sceneKey);
  const [boundSig, setBoundSig] = useState(signature);
  const [phase, setPhase] = useState<Phase>(() =>
    initialPhase(messages, confirmPrompt, instant),
  );

  if (sceneKey !== boundScene) {
    setBoundScene(sceneKey);
    setBoundSig(signature);
    setSettledCount(0);
    setPhase(initialPhase(messages, confirmPrompt, instant));
  } else if (signature !== boundSig) {
    // New step in the demo sequence — continue or restart from first new index
    const prevLen = boundSig.split("|").filter(Boolean).length;
    setBoundSig(signature);
    if (instant) {
      setSettledCount(messages.length);
      setPhase(initialPhase(messages, confirmPrompt, true));
    } else if (messages.length > settledCount) {
      setPhase(startForIndex(messages, settledCount, confirmPrompt));
    } else if (messages.length < prevLen) {
      setSettledCount(0);
      setPhase(startForIndex(messages, 0, confirmPrompt));
    }
  }

  useEffect(() => {
    if (instant) return;
    if (phase.kind === "done") return;

    if (phase.kind === "user") {
      const msg = messages[phase.index];
      if (!msg) {
        const id = window.setTimeout(() => setPhase({ kind: "done" }), 0);
        return () => window.clearTimeout(id);
      }
      if (phase.chars < msg.text.length) {
        const id = window.setTimeout(() => {
          setPhase({
            kind: "user",
            index: phase.index,
            chars: phase.chars + 1,
          });
        }, 9);
        return () => window.clearTimeout(id);
      }
      const id = window.setTimeout(() => {
        setSettledCount(phase.index + 1);
        setPhase(startForIndex(messages, phase.index + 1, confirmPrompt));
      }, 280);
      return () => window.clearTimeout(id);
    }

    if (phase.kind === "thinking") {
      const id = window.setTimeout(() => {
        setPhase({ kind: "agent", index: phase.index, chars: 0 });
      }, 1100);
      return () => window.clearTimeout(id);
    }

    if (phase.kind === "agent") {
      const msg = messages[phase.index];
      if (!msg) {
        const id = window.setTimeout(() => setPhase({ kind: "done" }), 0);
        return () => window.clearTimeout(id);
      }
      if (phase.chars < msg.text.length) {
        const ch = msg.text[phase.chars] ?? "";
        const delay = ch === " " ? 22 : /[.,!?]/.test(ch) ? 55 : 16;
        const id = window.setTimeout(() => {
          setPhase({
            kind: "agent",
            index: phase.index,
            chars: phase.chars + 1,
          });
        }, delay);
        return () => window.clearTimeout(id);
      }
      const id = window.setTimeout(() => {
        setSettledCount(phase.index + 1);
        setPhase(startForIndex(messages, phase.index + 1, confirmPrompt));
      }, 360);
      return () => window.clearTimeout(id);
    }

    if (phase.kind === "confirm" && confirmPrompt) {
      if (phase.chars < confirmPrompt.length) {
        const id = window.setTimeout(() => {
          setPhase({ kind: "confirm", chars: phase.chars + 1 });
        }, 22);
        return () => window.clearTimeout(id);
      }
      const id = window.setTimeout(() => setPhase({ kind: "done" }), 0);
      return () => window.clearTimeout(id);
    }
  }, [phase, messages, confirmPrompt, instant]);

  const completedCount =
    phase.kind === "done" || phase.kind === "confirm"
      ? settledCount
      : phase.index;

  const activeMsg =
    phase.kind === "user" || phase.kind === "agent"
      ? messages[phase.index]
      : null;
  const activeChars =
    phase.kind === "user" || phase.kind === "agent" ? phase.chars : 0;
  const showThinking = phase.kind === "thinking";

  const confirmText =
    phase.kind === "confirm"
      ? (confirmPrompt ?? "").slice(0, phase.chars)
      : phase.kind === "done" && confirmPrompt
        ? confirmPrompt
        : "";

  if (instant) {
    return (
      <VpsAiAgentShell>
        {messages.map((m, i) => (
          <div
            key={`i-${m.from}-${i}`}
            className={`vpsAiBubble vpsAiBubble--${m.from}`}
          >
            {m.text}
          </div>
        ))}
        {confirmPrompt ? <p className="vpsAiConfirm">{confirmPrompt}</p> : null}
      </VpsAiAgentShell>
    );
  }

  return (
    <VpsAiAgentShell>
      {messages.slice(0, completedCount).map((m, i) => (
        <div
          key={`done-${m.from}-${i}`}
          className={`vpsAiBubble vpsAiBubble--${m.from}`}
        >
          {m.text}
        </div>
      ))}

      {activeMsg && (phase.kind === "user" || phase.kind === "agent") ? (
        <div className={`vpsAiBubble vpsAiBubble--${activeMsg.from}`}>
          {activeMsg.text.slice(0, activeChars)}
          {activeChars < activeMsg.text.length ? (
            <span className="vpsAiAgentCursor" />
          ) : null}
        </div>
      ) : null}

      {showThinking ? (
        <div
          className="vpsAiBubble vpsAiBubble--agent vpsAiBubble--typing"
          aria-label="Agent is typing"
        >
          <span className="vpsAiTypingDots">
            <span />
            <span />
            <span />
          </span>
        </div>
      ) : null}

      {confirmText ? (
        <p className="vpsAiConfirm">
          {confirmText}
          {phase.kind === "confirm" &&
          confirmPrompt &&
          phase.chars < confirmPrompt.length ? (
            <span className="vpsAiAgentCursor" />
          ) : null}
        </p>
      ) : null}
    </VpsAiAgentShell>
  );
}
