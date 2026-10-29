/**
 * Transcript — user bubbles on the right. Role names are for screen readers.
 */
import type { ChatMessage } from "@/features/ai-advisor/hooks/useAiConversation";

type ConversationViewProps = {
  messages: readonly ChatMessage[];
};

function roleLabel(role: ChatMessage["role"]) {
  if (role === "user") return "You";
  if (role === "assistant") return "RunRacks AI";
  return "Notice";
}

export function ConversationView({ messages }: ConversationViewProps) {
  return (
    <div
      className="aiAdvisorTranscript"
      role="log"
      aria-label="Conversation"
      aria-live="polite"
    >
      {messages.map((msg) => (
        <article
          key={msg.id}
          className={`aiAdvisorMsg aiAdvisorMsg--${msg.role}`}
        >
          <p className="sr-only">{roleLabel(msg.role)}</p>
          <p className="aiAdvisorMsgBubble">{msg.text}</p>
        </article>
      ))}
    </div>
  );
}
