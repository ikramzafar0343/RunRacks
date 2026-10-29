"use client";

/**
 * Workload explorer — expandable Sage & Ink cards, smooth width swap.
 */
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import {
  SiDocker,
  SiGithub,
  SiGitlab,
  SiShopify,
  SiStripe,
  SiUbuntu,
  SiWordpress,
} from "react-icons/si";
import { HiCheck } from "react-icons/hi2";
import type { WorkloadItem } from "@/features/product-hosting/model/productHostingContent";
import { useWorkloadMobileReveal } from "@/features/product-hosting/components/useWorkloadMobileReveal";

type PhWorkloadsProps = {
  heading: string;
  intro: string;
  items: readonly WorkloadItem[];
};

const TOOL_ICONS: Record<string, { label: string; Icon: typeof SiDocker }> = {
  docker: { label: "Docker", Icon: SiDocker },
  github: { label: "GitHub", Icon: SiGithub },
  gitlab: { label: "GitLab", Icon: SiGitlab },
  wordpress: { label: "WordPress", Icon: SiWordpress },
  ubuntu: { label: "Ubuntu", Icon: SiUbuntu },
  shopify: { label: "Shopify", Icon: SiShopify },
  stripe: { label: "Stripe", Icon: SiStripe },
};

const HOVER_DELAY_MS = 70;

export function PhWorkloads({ heading, intro, items }: PhWorkloadsProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const activeIdRef = useRef(activeId);
  const rowRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const activeIndex = Math.max(
    0,
    items.findIndex((w) => w.id === activeId),
  );

  const activate = useCallback((id: string) => {
    if (activeIdRef.current === id) return;
    setActiveId(id);
  }, []);

  useWorkloadMobileReveal({
    rowRef,
    activeIdRef,
    activate,
    enabled: items.length > 0,
  });

  const scheduleActivate = useCallback(
    (id: string) => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
      if (activeIdRef.current === id) return;
      hoverTimer.current = setTimeout(() => activate(id), HOVER_DELAY_MS);
    },
    [activate],
  );

  const cancelScheduled = useCallback(() => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }, []);

  useEffect(() => {
    return () => cancelScheduled();
  }, [cancelScheduled]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const index = items.findIndex((w) => w.id === activeId);
    if (index < 0) return;
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next = (index + 1) % items.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      next = (index - 1 + items.length) % items.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = items.length - 1;
    } else {
      return;
    }
    const item = items[next];
    if (!item) return;
    cancelScheduled();
    activate(item.id);
    document.getElementById(`${baseId}-tab-${item.id}`)?.focus();
  }

  return (
    <section
      className="phSection phWorkloads"
      aria-labelledby={`${baseId}-heading`}
    >
      <div className="phInner">
        <header className="phWorkloadHeader">
          <h2 id={`${baseId}-heading`} className="phWorkloadHeading">
            {heading}
          </h2>
          <p className="phWorkloadIntro">{intro}</p>
        </header>

        <div
          ref={rowRef}
          className="phWorkloadRow"
          role="tablist"
          aria-label="Workload types"
          data-active-index={String(activeIndex)}
          onKeyDown={onKeyDown}
          onMouseLeave={cancelScheduled}
        >
          {items.map((w, i) => {
            const active = w.id === activeId;
            const tools = w.toolIds
              .map((id) => TOOL_ICONS[id])
              .filter((t): t is (typeof TOOL_ICONS)[string] => Boolean(t))
              .slice(0, 3);
            const benefits = w.benefits.slice(0, 2);

            return (
              <div
                key={w.id}
                role="tab"
                id={`${baseId}-tab-${w.id}`}
                aria-selected={active}
                tabIndex={active ? 0 : -1}
                className="phWorkloadCard"
                data-workload-id={w.id}
                data-active={active ? "true" : "false"}
                data-index={String(i)}
                onMouseEnter={() => scheduleActivate(w.id)}
                onFocus={() => {
                  cancelScheduled();
                  activate(w.id);
                }}
                onClick={() => {
                  cancelScheduled();
                  activate(w.id);
                }}
              >
                <div className="phWorkloadCardInner">
                  <h3 className="phWorkloadCardTitle">
                    {active ? (
                      w.title
                    ) : (
                      <>
                        {w.idleLines.map((line) => (
                          <span key={line} className="phWorkloadIdleLine">
                            {line}
                          </span>
                        ))}
                      </>
                    )}
                  </h3>

                  <div className="phWorkloadCardDetail" aria-hidden={!active}>
                    <p className="phWorkloadCardDesc">{w.description}</p>

                    {tools.length > 0 ? (
                      <ul
                        className="phWorkloadToolList"
                        aria-label="Tools teams often run"
                      >
                        {tools.map((t) => {
                          const Icon = t.Icon;
                          return (
                            <li key={t.label} title={t.label}>
                              <Icon
                                className="phWorkloadToolIcon"
                                aria-hidden
                              />
                              <span className="phWorkloadToolName">
                                {t.label}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}

                    <ul className="phWorkloadChecks">
                      {benefits.map((b) => (
                        <li key={b}>
                          <HiCheck
                            className="phWorkloadCheck"
                            size={15}
                            aria-hidden
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      className="phWorkloadCta"
                      href="#vps-pricing"
                      tabIndex={active ? 0 : -1}
                    >
                      See plans
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="phWorkloadToolsNote" role="note">
          Illustrative marks — not partnership claims.
        </p>
      </div>
    </section>
  );
}
