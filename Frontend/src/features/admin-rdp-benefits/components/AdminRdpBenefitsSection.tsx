/**
 * Interactive Admin RDP benefits — headline, tabs, panel + GSAP motion.
 */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useRef, useState } from "react";
import { AdminRdpBenefitsPanel } from "@/features/admin-rdp-benefits/components/AdminRdpBenefitsPanel";
import { AdminRdpBenefitsTabs } from "@/features/admin-rdp-benefits/components/AdminRdpBenefitsTabs";
import {
  ADMIN_RDP_BENEFITS_DEFAULT_TAB,
  ADMIN_RDP_BENEFITS_HEADING,
  ADMIN_RDP_BENEFITS_TABS,
  type BenefitTabId,
} from "@/features/admin-rdp-benefits/model/adminRdpBenefits.data";
import "@/features/admin-rdp-benefits/components/admin-rdp-benefits.css";
import "@/features/admin-rdp-benefits/components/admin-rdp-benefits-responsive.css";

gsap.registerPlugin(ScrollTrigger);

const TABS = ADMIN_RDP_BENEFITS_TABS;

export function AdminRdpBenefitsSection() {
  const rootRef = useRef<HTMLElement>(null);
  const tabTlRef = useRef<gsap.core.Timeline | null>(null);
  const reducedRef = useRef(false);
  const [activeId, setActiveId] = useState<BenefitTabId>(
    ADMIN_RDP_BENEFITS_DEFAULT_TAB,
  );

  const activeTab = TABS.find((t) => t.id === activeId) ?? TABS[0]!;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      reducedRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reducedRef.current) return;

      const title = root.querySelector("[data-ardp-title]");
      const tabs = root.querySelector("[data-ardp-tabs]");
      const copy = root.querySelector("[data-ardp-copy]");
      const art = root.querySelector("[data-ardp-art]");

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            once: true,
          },
        });

        if (title) {
          tl.from(
            title,
            { autoAlpha: 0, y: 24, duration: 0.65, immediateRender: false },
            0,
          );
        }
        if (tabs) {
          tl.from(
            tabs,
            { autoAlpha: 0, y: 12, duration: 0.5, immediateRender: false },
            0.12,
          );
        }
        if (copy) {
          tl.from(
            copy,
            { autoAlpha: 0, y: 18, duration: 0.6, immediateRender: false },
            0.18,
          );
        }
        if (art) {
          tl.from(
            art,
            { autoAlpha: 0, x: 24, duration: 0.75, immediateRender: false },
            0.22,
          );
        }
      }, root);

      return () => ctx.revert();
    },
    { scope: rootRef },
  );

  const selectTab = useCallback(
    (id: BenefitTabId) => {
      if (id === activeId) return;

      const root = rootRef.current;
      if (!root || reducedRef.current) {
        setActiveId(id);
        queueMicrotask(() => {
          root
            ?.querySelector<HTMLElement>(`#ardp-benefit-tab-${id}`)
            ?.focus({ preventScroll: true });
        });
        return;
      }

      tabTlRef.current?.kill();

      const copy = root.querySelector("[data-ardp-copy]");
      const art = root.querySelector("[data-ardp-art]");

      const tl = gsap.timeline({
        onComplete: () => {
          setActiveId(id);
          requestAnimationFrame(() => {
            const nextCopy = root.querySelector("[data-ardp-copy]");
            const nextArt = root.querySelector("[data-ardp-art]");
            const enter = gsap.timeline({
              onComplete: () => {
                root
                  .querySelector<HTMLElement>(`#ardp-benefit-tab-${id}`)
                  ?.focus({ preventScroll: true });
              },
            });
            if (nextCopy) {
              gsap.set(nextCopy, { autoAlpha: 0, x: -10 });
              enter.to(
                nextCopy,
                { autoAlpha: 1, x: 0, duration: 0.28, ease: "power2.out" },
                0,
              );
            }
            if (nextArt) {
              gsap.set(nextArt, { autoAlpha: 0, x: 14, scale: 0.99 });
              enter.to(
                nextArt,
                {
                  autoAlpha: 1,
                  x: 0,
                  scale: 1,
                  duration: 0.34,
                  ease: "power2.out",
                },
                0.02,
              );
            }
            tabTlRef.current = enter;
          });
        },
      });

      if (copy) {
        tl.to(
          copy,
          { autoAlpha: 0, y: -6, duration: 0.12, ease: "power2.in" },
          0,
        );
      }
      if (art) {
        tl.to(
          art,
          { autoAlpha: 0, y: -6, duration: 0.12, ease: "power2.in" },
          0,
        );
      }
      if (!copy && !art) {
        setActiveId(id);
      }

      tabTlRef.current = tl;
    },
    [activeId],
  );

  useEffect(() => {
    return () => {
      tabTlRef.current?.kill();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="admin-rdp-usa-benefits"
      className="ardpBenefits"
      aria-labelledby="admin-rdp-usa-benefits-heading"
    >
      <div className="ardpBenefits__container">
        <h2
          id="admin-rdp-usa-benefits-heading"
          className="ardpBenefits__title"
          data-ardp-title
        >
          {ADMIN_RDP_BENEFITS_HEADING}
        </h2>
        <AdminRdpBenefitsTabs
          tabs={TABS}
          activeId={activeId}
          onSelect={selectTab}
          labelledBy="admin-rdp-usa-benefits-heading"
        />
        <AdminRdpBenefitsPanel tab={activeTab} />
      </div>
    </section>
  );
}
