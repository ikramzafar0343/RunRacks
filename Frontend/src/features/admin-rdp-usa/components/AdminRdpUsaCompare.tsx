/**
 * Featured Admin RDP card vs piecemeal stack — GSAP scroll entrance.
 */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import {
  Check,
  Clock3,
  HardDrive,
  LayoutPanelLeft,
  LifeBuoy,
  MonitorSmartphone,
  Server,
} from "lucide-react";
import { useRef } from "react";
import {
  ADMIN_RDP_USA_COMPARE,
  type CompareStackIcon,
} from "@/features/admin-rdp-usa/model/adminRdpUsaCompare";
import "@/features/admin-rdp-usa/components/admin-rdp-usa-compare.css";
import "@/features/admin-rdp-usa/components/admin-rdp-usa-compare-stack.css";

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<CompareStackIcon, LucideIcon> = {
  server: Server,
  support: LifeBuoy,
  panel: LayoutPanelLeft,
  backup: HardDrive,
  monitor: MonitorSmartphone,
  time: Clock3,
};

export function AdminRdpUsaCompare() {
  const rootRef = useRef<HTMLElement>(null);
  const {
    headingId,
    heading,
    lead,
    featured,
    vsLabel,
    stack,
    stackTotalLabel,
    stackTotalNote,
    disclaimer,
  } = ADMIN_RDP_USA_COMPARE;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (reduce.matches) return;

      const header = root.querySelector("[data-cmp-header]");
      const featuredEl = root.querySelector("[data-cmp-featured-wrap]");
      const vs = root.querySelector("[data-cmp-vs]");
      const items = root.querySelectorAll("[data-cmp-item]");
      const foot = root.querySelector("[data-cmp-foot]");

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            once: true,
          },
        });

        if (header) {
          tl.from(header, { autoAlpha: 0, y: 22, duration: 0.55 }, 0);
        }
        if (featuredEl) {
          tl.from(featuredEl, { autoAlpha: 0, x: -28, duration: 0.7 }, 0.12);
        }
        if (vs) {
          tl.from(vs, { autoAlpha: 0, scale: 0.7, duration: 0.4 }, 0.28);
        }
        if (items.length) {
          tl.from(
            items,
            { autoAlpha: 0, y: 18, duration: 0.45, stagger: 0.08 },
            0.22,
          );
        }
        if (foot) {
          tl.from(foot, { autoAlpha: 0, y: 12, duration: 0.4 }, "-=0.15");
        }
      }, root);

      return () => ctx.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="admin-rdp-usa-compare"
      className="ardpCompare"
      aria-labelledby={headingId}
    >
      <div className="ardpCompareInner">
        <header className="ardpCompareHeader" data-cmp-header>
          <h2 id={headingId} className="ardpCompareHeading">
            {heading}
          </h2>
          <p className="ardpCompareLead">{lead}</p>
        </header>

        <div className="ardpCompareLayout">
          <div className="ardpCompareFeaturedWrap" data-cmp-featured-wrap>
            <span className="ardpCompareVs" data-cmp-vs aria-hidden>
              {vsLabel}
            </span>
            <article className="ardpCompareFeatured">
              <p className="ardpCompareBrand">{featured.brand}</p>
              <p className="ardpCompareEyebrow">{featured.eyebrow}</p>
              <p className="ardpCompareSummary">{featured.summary}</p>
              <h3 className="ardpComparePlanName">{featured.planName}</h3>

              <ul className="ardpCompareFeatures">
                {featured.features.map((item) => (
                  <li key={item}>
                    <Check
                      className="ardpCompareCheck"
                      size={16}
                      strokeWidth={2.5}
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="ardpComparePriceBlock">
                <div className="ardpComparePriceRow">
                  <p className="ardpComparePriceLabel">{featured.priceLabel}</p>
                  <span className="ardpCompareBadge">{featured.badge}</span>
                </div>
                <p className="ardpComparePriceNote">{featured.priceNote}</p>
                <div className="ardpCompareActions">
                  <Link
                    href={featured.primaryCta.href as Route}
                    className="ardpCompareBtn ardpCompareBtn--primary"
                  >
                    {featured.primaryCta.label}
                  </Link>
                  <Link
                    href={featured.secondaryCta.href as Route}
                    className="ardpCompareBtn ardpCompareBtn--ghost"
                  >
                    {featured.secondaryCta.label}
                  </Link>
                </div>
              </div>
            </article>
          </div>

          <div className="ardpCompareStackCol">
            <ul className="ardpCompareStack">
              {stack.map((item, index) => {
                const Icon = ICONS[item.icon];
                return (
                  <li
                    key={item.id}
                    className="ardpCompareStackItem"
                    data-cmp-item
                  >
                    {index > 0 ? (
                      <span className="ardpComparePlus" aria-hidden>
                        +
                      </span>
                    ) : null}
                    <span className="ardpCompareIcon" aria-hidden>
                      <Icon size={20} strokeWidth={1.75} />
                    </span>
                    <div className="ardpCompareStackCopy">
                      <h3 className="ardpCompareStackTitle">{item.title}</h3>
                      <p className="ardpCompareStackBody">{item.body}</p>
                    </div>
                    <p className="ardpCompareTag">{item.tag}</p>
                  </li>
                );
              })}
            </ul>

            <div className="ardpCompareStackFoot" data-cmp-foot>
              <p className="ardpCompareStackTotal">{stackTotalLabel}</p>
              <p className="ardpCompareStackNote">{stackTotalNote}</p>
            </div>
          </div>
        </div>

        <p className="ardpCompareDisclaimer">{disclaimer}</p>
      </div>
    </section>
  );
}
