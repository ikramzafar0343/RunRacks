"use client";

/**
 * Advisor sidebar — tools, saved chats, and delete.
 * On narrow screens it is a drawer opened from the menu button.
 */
import { Compass, Plus, Sparkles, Tags, Trash2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { HistoryPhase } from "@/features/ai-advisor/hooks/useAiChatHistory";
import { AI_COPY } from "@/features/ai-advisor/model/aiContent";

type SidebarChat = { id: string; title: string };

type AiSidebarProps = {
  open: boolean;
  drawer: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onPlanFinder: () => void;
  onPlans: () => void;
  chats: readonly SidebarChat[];
  activeId: string | null;
  historyPhase: HistoryPhase;
  notice: string | null;
  error: string | null;
  lockedId: string | null;
  onOpenChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
};

export function AiSidebar({
  open,
  drawer,
  onClose,
  onNewChat,
  onPlanFinder,
  onPlans,
  chats,
  activeId,
  historyPhase,
  notice,
  error,
  lockedId,
  onOpenChat,
  onDeleteChat,
}: AiSidebarProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const hidden = drawer && !open;

  useEffect(() => {
    if (!open || !drawer) return;
    closeRef.current?.focus();
  }, [open, drawer]);

  const empty =
    historyPhase === "loading"
      ? AI_COPY.historyLoading
      : (error ??
        (historyPhase === "unavailable"
          ? AI_COPY.historyUnavailable
          : AI_COPY.historyEmpty));

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
          <button
            type="button"
            className="aiSidebarItem"
            onClick={onPlanFinder}
          >
            <Compass size={16} aria-hidden />
            Plan Finder
          </button>
          <button type="button" className="aiSidebarItem" onClick={onPlans}>
            <Tags size={16} aria-hidden />
            Plans
          </button>
        </div>

        <div className="aiSidebarHistory">
          <p className="aiSidebarSection">Chats</p>
          {chats.length === 0 ? (
            <p className="aiSidebarEmpty">{empty}</p>
          ) : (
            <ul className="aiSidebarChats">
              {chats.map((chat) => {
                const active = chat.id === activeId;
                return (
                  <li
                    key={chat.id}
                    className={
                      active
                        ? "aiSidebarChat aiSidebarChat--active"
                        : "aiSidebarChat"
                    }
                  >
                    <button
                      type="button"
                      className="aiSidebarChatBtn"
                      aria-current={active ? "true" : undefined}
                      title={chat.title}
                      onClick={() => onOpenChat(chat.id)}
                    >
                      {chat.title}
                    </button>
                    <button
                      type="button"
                      className="aiSidebarChatDelete"
                      aria-label={`Delete ${chat.title}`}
                      disabled={lockedId === chat.id}
                      onClick={() => onDeleteChat(chat.id)}
                    >
                      <Trash2 size={15} aria-hidden />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {chats.length > 0 && notice ? (
            <p className="aiSidebarEmpty">{notice}</p>
          ) : null}
          {chats.length > 0 && error ? (
            <p className="aiSidebarEmpty" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </nav>
    </>
  );
}
