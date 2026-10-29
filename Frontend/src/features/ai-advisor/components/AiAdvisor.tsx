"use client";

/**
 * AI Advisor — chat column for Linux VPS, Windows VPS, and Admin RDP.
 */
import { Menu } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiAdvisorHeader } from "@/features/ai-advisor/components/AiAdvisorHeader";
import { AiPlansDock } from "@/features/ai-advisor/components/AiPlansDock";
import { AiSidebar } from "@/features/ai-advisor/components/AiSidebar";
import { AiUnavailableState } from "@/features/ai-advisor/components/AiUnavailableState";
import { ChatComposer } from "@/features/ai-advisor/components/ChatComposer";
import { ConversationView } from "@/features/ai-advisor/components/ConversationView";
import { StarterPromptList } from "@/features/ai-advisor/components/StarterPromptList";
import {
  AI_COPY,
  AI_STARTERS,
  isAiTopic,
  startersForTopic,
  type AiStarterWithIcon,
} from "@/features/ai-advisor/model/aiContent";
import { useAiConversation } from "@/features/ai-advisor/hooks/useAiConversation";
import { PlanFinderDialog } from "@/features/ai-advisor/plan-finder/PlanFinderDialog";
import { fetchAiConfig } from "@/features/ai-advisor/services/aiClient";
import type { AiTopic } from "@/shared/lib/apiContracts";
import type { VpsFamily } from "@/features/vps-pricing/model/types";
import "@/features/ai-advisor/components/ai-advisor.css";
import "@/features/ai-advisor/components/ai-advisor-chat.css";
import "@/features/ai-advisor/components/ai-advisor-composer.css";
import "@/features/ai-advisor/components/ai-advisor-dock.css";
import "@/features/ai-advisor/components/ai-advisor-panels.css";
import "@/features/ai-advisor/components/ai-advisor-dialog.css";
import "@/features/ai-advisor/components/ai-advisor-regions.css";

type AiAdvisorProps = {
  topicParam?: string | null;
};

export function AiAdvisor({ topicParam = null }: AiAdvisorProps) {
  const topic: AiTopic | null = isAiTopic(topicParam) ? topicParam : null;
  const [starters, setStarters] =
    useState<readonly AiStarterWithIcon[]>(AI_STARTERS);
  const [disclaimer, setDisclaimer] = useState<string>(AI_COPY.disclaimer);
  const [planOpen, setPlanOpen] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [planFamily, setPlanFamily] = useState<VpsFamily | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);

  const {
    draft,
    setDraft,
    messages,
    phase,
    applyChip,
    send,
    resetChat,
    hasMessages,
    isDirty,
  } = useAiConversation(topic);

  useEffect(() => {
    let cancelled = false;
    fetchAiConfig()
      .then((cfg) => {
        if (cancelled) return;
        setDisclaimer(cfg.disclaimer);
        setStarters(startersForTopic(topic));
      })
      .catch(() => {
        if (cancelled) return;
        setStarters(startersForTopic(topic));
      });
    return () => {
      cancelled = true;
    };
  }, [topic]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 899px)");
    const apply = () => {
      setDrawer(media.matches);
      if (!media.matches) setSidebarOpen(false);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!sidebarOpen || !drawer) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setSidebarOpen(false);
      menuRef.current?.focus();
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [sidebarOpen, drawer]);

  const pending = phase.kind === "submitting";
  const banner = useMemo(() => {
    if (phase.kind === "unavailable") {
      return { message: phase.message, variant: "unavailable" as const };
    }
    if (phase.kind === "failed") {
      return { message: phase.message, variant: "error" as const };
    }
    return null;
  }, [phase]);

  function handleNewChat() {
    if (isDirty) {
      const ok = window.confirm("Start a new chat? This clears the current session.");
      if (!ok) return;
    }
    resetChat();
    setPlansOpen(false);
    setSidebarOpen(false);
  }

  function closeSidebar() {
    setSidebarOpen(false);
    if (drawer) menuRef.current?.focus();
  }

  return (
    <div className="aiAdvisor">
      <AiSidebar
        open={sidebarOpen}
        drawer={drawer}
        messages={messages}
        onClose={closeSidebar}
        onNewChat={handleNewChat}
        onPlanFinder={() => {
          setPlanOpen(true);
          setSidebarOpen(false);
        }}
        onPlans={() => {
          setPlansOpen(true);
          setSidebarOpen(false);
        }}
      />

      <div
        className={
          plansOpen ? "aiAdvisorShell aiAdvisorShell--split" : "aiAdvisorShell"
        }
      >
        <div className="aiAdvisorMain">
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
            <StarterPromptList starters={starters} onSelect={applyChip} />
          ) : null}

          {banner ? (
            <AiUnavailableState
              message={banner.message}
              variant={banner.variant}
            />
          ) : null}

          {hasMessages ? <ConversationView messages={messages} /> : (
            <div className="aiAdvisorSpacer" aria-hidden />
          )}

          <div className="aiAdvisorComposerShell">
            <ChatComposer
              value={draft}
              onChange={setDraft}
              onSend={() => {
                void send();
              }}
              pending={pending}
            />
            <p className="aiAdvisorDisclaimer">{disclaimer}</p>
          </div>
        </div>

        <AiPlansDock
          open={plansOpen}
          family={planFamily}
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
