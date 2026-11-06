"use client";

/**
 * Advisor chrome: starter copy, and the sidebar drawer on narrow screens.
 */
import { useEffect, useRef, useState } from "react";
import {
  AI_COPY,
  AI_STARTERS,
  startersForTopic,
  type AiStarterWithIcon,
} from "@/features/ai-advisor/model/aiContent";
import { fetchAiConfig } from "@/features/ai-advisor/services/aiClient";
import type { AiTopic } from "@/shared/lib/apiContracts";

export function useAdvisorFrame(topic: AiTopic | null) {
  const [starters, setStarters] =
    useState<readonly AiStarterWithIcon[]>(AI_STARTERS);
  const [disclaimer, setDisclaimer] = useState<string>(AI_COPY.disclaimer);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAiConfig()
      .then((cfg) => {
        if (cancelled) return;
        setDisclaimer(cfg.disclaimer || AI_COPY.disclaimer);
        if (cfg.starters?.length) {
          const icons = new Map(
            AI_STARTERS.map((s) => [s.id, s.icon] as const),
          );
          setStarters(
            cfg.starters.map((s) => ({
              ...s,
              icon: icons.get(s.id) ?? "server",
            })),
          );
        } else {
          setStarters(startersForTopic(topic));
        }
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

  function closeSidebar() {
    setSidebarOpen(false);
    if (drawer) menuRef.current?.focus();
  }

  return {
    starters,
    disclaimer,
    sidebarOpen,
    setSidebarOpen,
    drawer,
    menuRef,
    closeSidebar,
  };
}
