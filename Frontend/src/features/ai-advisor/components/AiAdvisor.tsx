"use client";

import { Menu } from "lucide-react";
import { useMemo, useState } from "react";
import { AiAdvisorHeader } from "@/features/ai-advisor/components/AiAdvisorHeader";
import { AiPlansDock } from "@/features/ai-advisor/components/AiPlansDock";
import { AiSidebar } from "@/features/ai-advisor/components/AiSidebar";
import { AiUnavailableState } from "@/features/ai-advisor/components/AiUnavailableState";
import { ChatComposer } from "@/features/ai-advisor/components/ChatComposer";
import { ConversationView } from "@/features/ai-advisor/components/ConversationView";
import { StarterPromptList } from "@/features/ai-advisor/components/StarterPromptList";
import { useAdvisorFrame } from "@/features/ai-advisor/hooks/useAdvisorFrame";
import { useAiChatHistory } from "@/features/ai-advisor/hooks/useAiChatHistory";
import { useConsumeAsk } from "@/features/ai-advisor/hooks/useConsumeAsk";
import { useAiConversation } from "@/features/ai-advisor/hooks/useAiConversation";
import { AI_COPY, isAiTopic } from "@/features/ai-advisor/model/aiContent";
import {
  isAskedCustomSpecBuild,
  matchAskedBudgetPlanIds,
  matchAskedFamily,
  matchAskedPlanIds,
} from "@/features/ai-advisor/model/askedPlans";
import { PlanFinderDialog } from "@/features/ai-advisor/plan-finder/PlanFinderDialog";
import type { AiTopic } from "@/shared/lib/apiContracts";
import type { VpsFamily } from "@/features/vps-pricing";
import { useNotify } from "@/shared/ui/notify/NotifyProvider";
import "@/features/ai-advisor/components/ai-advisor.css";
import "@/features/ai-advisor/components/ai-advisor-chat.css";
import "@/features/ai-advisor/components/ai-advisor-motion.css";
import "@/features/ai-advisor/components/ai-advisor-composer.css";
import "@/features/ai-advisor/components/ai-advisor-dock.css";
import "@/features/ai-advisor/components/ai-advisor-panels.css";
import "@/features/ai-advisor/components/ai-advisor-dialog.css";
import "@/features/ai-advisor/components/ai-advisor-regions.css";

type AiAdvisorProps = {
  topicParam?: string | null;
  ask?: string | null;
};

export function AiAdvisor({ topicParam = null, ask = null }: AiAdvisorProps) {
  const { toast, confirm } = useNotify();
  const topic: AiTopic | null = isAiTopic(topicParam) ? topicParam : null;
  const [planOpen, setPlanOpen] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [planFamily, setPlanFamily] = useState<VpsFamily | null>(null);
  const [askedPlanIds, setAskedPlanIds] = useState<string[] | null>(null);
  const {
    starters,
    disclaimer,
    sidebarOpen,
    setSidebarOpen,
    drawer,
    menuRef,
    closeSidebar,
  } = useAdvisorFrame(topic);

  const {
    draft,
    setDraft,
    messages,
    phase,
    sessionStore,
    applyChip,
    send,
    retry,
    stop,
    resetChat,
    openConversation,
    conversationId,
    savedTick,
    hasMessages,
    isDirty,
  } = useAiConversation(topic);

  const activeTitle =
    messages.find((message) => message.role === "user")?.text ?? null;
  const history = useAiChatHistory({
    savedTick,
    activeId: conversationId,
    activeTitle,
    activeStore: sessionStore,
  });

  function inspectPromptForPlans(text: string) {
    // Custom CPU/RAM/NVMe/bandwidth builds are quoted via Customize — do not
    // open the catalog dock with a nearest published SKU.
    if (isAskedCustomSpecBuild(text)) {
      setAskedPlanIds(null);
      setPlansOpen(false);
      return;
    }
    const budgetIds = matchAskedBudgetPlanIds(text);
    if (budgetIds.length > 0) {
      setAskedPlanIds(budgetIds);
      setPlanFamily(null);
      setPlansOpen(true);
      return;
    }
    const ids = matchAskedPlanIds(text);
    if (ids.length > 0) {
      setAskedPlanIds(ids);
      setPlansOpen(true);
      return;
    }
    const family = matchAskedFamily(text);
    if (family) {
      setAskedPlanIds(null);
      setPlanFamily(family);
      setPlansOpen(true);
    }
  }

  function handleSend() {
    const text = draft.trim();
    if (text) inspectPromptForPlans(text);
    void send();
  }
  useConsumeAsk(ask, (text) => {
    inspectPromptForPlans(text);
    void send(text);
  });

  const pending = phase.kind === "submitting" || phase.kind === "streaming";
  const banner = useMemo(() => {
    if (phase.kind === "unavailable") {
      return { message: phase.message, variant: "unavailable" as const };
    }
    if (phase.kind === "failed") {
      return { message: phase.message, variant: "error" as const };
    }
    return null;
  }, [phase]);

  async function handleNewChat() {
    if (isDirty) {
      const ok = await confirm({
        ...AI_COPY.newChatConfirm,
        tone: "info",
      });
      if (!ok) return;
    }
    resetChat();
    setPlansOpen(false);
    closeSidebar();
  }

  function handleOpenChat(id: string) {
    if (id === conversationId) {
      closeSidebar();
      return;
    }
    void history.openChat(id).then((loaded) => {
      if (!loaded) return;
      openConversation(loaded.id, loaded.messages, loaded.store);
      setPlansOpen(false);
      closeSidebar();
    });
  }

  async function handleDeleteChat(id: string) {
    if (pending && id === conversationId) return;
    const ok = await confirm({
      ...AI_COPY.deleteChatConfirm,
      tone: "error",
    });
    if (!ok) return;
    const removed = await history.removeChat(id);
    if (!removed) {
      toast({ tone: "error", ...AI_COPY.chatDeleteFailed });
      return;
    }
    toast({ tone: "success", ...AI_COPY.chatDeleted });
    if (id !== conversationId) return;
    resetChat();
    setPlansOpen(false);
  }

  return (
    <div className="aiAdvisor">
      <AiSidebar
        open={sidebarOpen}
        drawer={drawer}
        chats={history.chats}
        activeId={conversationId}
        historyPhase={history.phase}
        notice={history.notice}
        error={history.error}
        lockedId={pending ? conversationId : null}
        onClose={closeSidebar}
        onNewChat={handleNewChat}
        onOpenChat={handleOpenChat}
        onDeleteChat={handleDeleteChat}
        onPlanFinder={() => {
          setPlanOpen(true);
          closeSidebar();
        }}
        onPlans={() => {
          setAskedPlanIds(null);
          setPlansOpen(true);
          closeSidebar();
        }}
      />

      <div
        className={
          plansOpen ? "aiAdvisorShell aiAdvisorShell--split" : "aiAdvisorShell"
        }
      >
        <div
          className={
            hasMessages ? "aiAdvisorMain aiAdvisorMain--chat" : "aiAdvisorMain"
          }
        >
          <div className="aiAdvisorChrome">
            <button
              type="button"
              ref={menuRef}
              className="aiSidebarToggle"
              aria-expanded={sidebarOpen}
              aria-controls="ai-sidebar"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} aria-hidden />
              Menu
            </button>

            {!hasMessages ? <AiAdvisorHeader /> : null}
            {!hasMessages ? (
              <StarterPromptList
                starters={starters}
                onSelect={(starter) => {
                  applyChip(starter);
                  inspectPromptForPlans(starter.prompt);
                }}
              />
            ) : null}

            {sessionStore === "memory" ? (
              <p className="aiSessionNotice" role="status">
                {AI_COPY.tempSession}
              </p>
            ) : null}

            {banner ? (
              <AiUnavailableState
                message={banner.message}
                variant={banner.variant}
                {...(banner.variant === "error"
                  ? { onRetry: () => void retry() }
                  : {})}
              />
            ) : null}
          </div>

          {hasMessages ? (
            <ConversationView
              messages={messages}
              onChip={(label) => {
                inspectPromptForPlans(label);
                void send(label);
              }}
              streaming={pending}
            />
          ) : (
            <div className="aiAdvisorSpacer" aria-hidden />
          )}

          <div className="aiAdvisorComposerShell">
            <ChatComposer
              value={draft}
              onChange={setDraft}
              onSend={handleSend}
              onStop={stop}
              pending={pending}
            />
            <p className="aiAdvisorDisclaimer">{disclaimer}</p>
          </div>
        </div>

        <AiPlansDock
          open={plansOpen}
          family={planFamily}
          planIds={askedPlanIds}
          onClose={() => setPlansOpen(false)}
        />
      </div>

      <PlanFinderDialog
        open={planOpen}
        onClose={() => setPlanOpen(false)}
        onComplete={(family) => {
          setPlanFamily(family);
          setPlansOpen(true);
        }}
      />
    </div>
  );
}
