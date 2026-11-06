/**
 * Typewriter reveal for one assistant bubble.
 */
import type { AdvisorCustomizeQuote } from "./chatTypes";
import type { ChatMessage, ChatPhase } from "./useAiConversation";

const TYPE_MS = 18;
const TYPE_CHUNK = 2;

type SetMessages = (
  value: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[]),
) => void;

export function startTypewriter(input: {
  assistantId: string;
  fullText: string;
  messageId: string | undefined;
  chips: { id: string; label: string }[] | undefined;
  quote: AdvisorCustomizeQuote | undefined;
  planIds: string[] | undefined;
  setPhase: (phase: ChatPhase) => void;
  setMessages: SetMessages;
  clearTimer: () => void;
  armTimer: (id: ReturnType<typeof setTimeout>) => void;
}): Promise<void> {
  const {
    assistantId,
    fullText,
    messageId,
    chips,
    quote,
    planIds,
    setPhase,
    setMessages,
    clearTimer,
    armTimer,
  } = input;
  return new Promise((resolve) => {
    clearTimer();
    let i = 0;
    setPhase({ kind: "streaming" });
    const targetId = messageId ?? assistantId;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantId
          ? { ...m, id: targetId, status: "typing", text: "" }
          : m,
      ),
    );
    const tick = () => {
      i = Math.min(fullText.length, i + TYPE_CHUNK);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === targetId
            ? { ...m, text: fullText.slice(0, i), status: "typing" }
            : m,
        ),
      );
      if (i >= fullText.length) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === targetId
              ? {
                  ...m,
                  text: fullText,
                  status: "done",
                  ...(chips?.length ? { chips } : {}),
                  ...(quote ? { quote } : {}),
                  ...(planIds?.length ? { planIds } : {}),
                }
              : m,
          ),
        );
        resolve();
        return;
      }
      armTimer(setTimeout(tick, TYPE_MS));
    };
    armTimer(setTimeout(tick, TYPE_MS));
  });
}
