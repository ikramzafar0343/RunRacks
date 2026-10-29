"use client";

/**
 * Advisor sidebar — labeled tools and this-session chats.
 * On narrow screens it is a drawer opened from the menu button.
 */
import { Compass, Plus, Sparkles, Tags, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/features/ai-advisor/hooks/useAiConversation";
import { AI_COPY } from "@/features/ai-advisor/model/aiContent";

type AiSidebarProps = {
  open: boolean;
  drawer: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onPlanFinder: () => void;
  onPlans: () => void;
  messages: readonly ChatMessage[];
};

export function AiSidebar({
  open,
  drawer,
  onClose,
  onNewChat,
  onPlanFinder,
  onPlans,
  messages,
}: AiSidebarProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const hidden = drawer && !open;
  const turns = messages.filter((message) => message.role === "user");

  useEffect(() => {
    if (!open || !drawer) return;
    closeRef.current?.focus();
  }, [open, drawer]);

  return (
    <>
      {open && drawer ? (
        <button
          type="button"
          className="aiSidebarBackdrop"
          aria-label="Close menu"
          onClick={onClose}
        />
      ) : null}
      <nav
        id="ai-sidebar"
        className={open ? "aiSidebar aiSidebar--open" : "aiSidebar"}
        aria-label="Advisor"
        aria-hidden={hidden ? true : undefined}
        inert={hidden ? true : undefined}
      >
        <div className="aiSidebarHead">
          <span className="aiSidebarBrand">
            <span className="aiSidebarMark" aria-hidden>
              <Sparkles size={15} strokeWidth={2} />
            </span>
            RunRacks AI
          </span>
          <button
            ref={closeRef}
            type="button"
            className="aiSidebarClose"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="aiSidebarNav">
          <button type="button" className="aiSidebarItem" onClick={onNewChat}>
            <Plus size={16} aria-hidden />
            New chat
          </button>
          <button type="button" className="aiSidebarItem" onClick={onPlanFinder}>
            <Compass size={16} aria-hidden />
            Plan Finder
          </button>
          <button type="button" className="aiSidebarItem" onClick={onPlans}>
            <Tags size={16} aria-hidden />
            Plans
          </button>
        </div>

        <p className="aiSidebarSection">This session</p>
        {turns.length === 0 ? (
          <p className="aiSidebarEmpty">{AI_COPY.historyEmpty}</p>
        ) : (
          <ul className="aiSidebarChats">
            {turns.map((message) => (
              <li key={message.id} className="aiSidebarChat" title={message.text}>
                {message.text}
              </li>
            ))}
          </ul>
        )}
      </nav>
    </>
  );
}
