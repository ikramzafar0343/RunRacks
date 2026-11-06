/**
 * Transcript — thinking dots, typewriter bubble, chips, stick-to-bottom.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { AdvisorPlanCards } from "@/features/ai-advisor/components/AdvisorPlanCards";
import { AdvisorQuoteCard } from "@/features/ai-advisor/components/AdvisorQuoteCard";
import {
  AdvisorChipMark,
  AdvisorReplyText,
} from "@/features/ai-advisor/components/AdvisorReplyText";
import type { ChatMessage } from "@/features/ai-advisor/hooks/useAiConversation";

type ConversationViewProps = {
  messages: readonly ChatMessage[];
  onChip?: (label: string) => void;
  streaming?: boolean;
};

function roleLabel(role: ChatMessage["role"]) {
  if (role === "user") return "You";
  if (role === "assistant") return "RunRacks AI";
  return "Notice";
}

function ThinkingDots() {
  return (
    <p
      className="aiAdvisorMsgBubble aiAdvisorMsgBubble--thinking"
      aria-label="Assistant is thinking"
    >
      <span className="aiThinkingDots" aria-hidden>
        <span className="aiThinkingDot" />
        <span className="aiThinkingDot" />
        <span className="aiThinkingDot" />
        <span className="aiThinkingDot" />
      </span>
    </p>
  );
}

export function ConversationView({
  messages,
  onChip,
  streaming = false,
}: ConversationViewProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [stick, setStick] = useState(true);
  const [showJump, setShowJump] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    function onScroll() {
      if (!el) return;
      const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      setStick(near);
      setShowJump(!near);
    }
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!stick) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, stick, streaming]);

  return (
    <div className="aiAdvisorTranscriptWrap">
      <div
        className="aiAdvisorTranscript"
        ref={scrollerRef}
        role="log"
        aria-label="Conversation"
        aria-busy={streaming || undefined}
      >
        {messages.map((msg, index) => {
          const isLastAssistant =
            msg.role === "assistant" && index === messages.length - 1;
          const thinking =
            msg.role === "assistant" &&
            (msg.status === "thinking" || (!msg.text && msg.status !== "done"));
          const typing = msg.status === "typing";

          return (
            <article
              key={msg.id}
              className={`aiAdvisorMsg aiAdvisorMsg--${msg.role}`}
            >
              <p className="aiAdvisorMsgRole" aria-hidden>
                {roleLabel(msg.role)}
              </p>
              {thinking ? (
                <ThinkingDots />
              ) : (
                <p
                  className={
                    typing
                      ? "aiAdvisorMsgBubble aiAdvisorMsgBubble--typing"
                      : "aiAdvisorMsgBubble"
                  }
                  aria-live={
                    isLastAssistant && streaming ? "polite" : undefined
                  }
                >
                  {msg.role === "assistant" ? (
                    <AdvisorReplyText text={msg.text} />
                  ) : (
                    msg.text
                  )}
                  {typing ? <span className="aiTypeCaret" aria-hidden /> : null}
                </p>
              )}
              {msg.quote && msg.status !== "typing" ? (
                <AdvisorQuoteCard quote={msg.quote} />
              ) : null}
              {msg.planIds && msg.planIds.length > 0 && msg.status !== "typing" ? (
                <AdvisorPlanCards planIds={msg.planIds} text={msg.text} />
              ) : null}
              {msg.chips && msg.chips.length > 0 && msg.status !== "typing" ? (
                <ul className="aiFollowUps" aria-label="Suggested replies">
                  {msg.chips.map((c) => (
                    <li key={c.id}>
                      <button
                        type="button"
                        className="aiFollowUpChip"
                        onClick={() => onChip?.(c.label)}
                      >
                        <AdvisorChipMark id={c.id} label={c.label} />
                        {c.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          );
        })}
        <div ref={endRef} />
      </div>
      {showJump ? (
        <button
          type="button"
          className="aiJumpLatest"
          onClick={() => {
            setStick(true);
            endRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Jump to latest
        </button>
      ) : null}
    </div>
  );
}
