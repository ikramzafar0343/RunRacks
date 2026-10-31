/**
 * RunRacks VPS 1 vs competitor entry plans — light Sage & Ink comparison.
 */
"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import {
  metricValue,
  VPS_COMPETITOR_COMPARE,
  type CompareLogo,
  type CompareMetricKey,
  type CompareProvider,
} from "@/features/vps-product/model/vpsCompetitorCompare";
import "@/features/vps-product/components/vps-competitor-compare.css";
import "@/features/vps-product/components/vps-competitor-compare-marks.css";

gsap.registerPlugin(ScrollTrigger);

function cellClass(provider: CompareProvider, key: CompareMetricKey): string {
  const featured =
    provider.featured && key !== "plan" && key !== "cheaper"
      ? " vpsCmpCellFeatured"
      : "";
  return `vpsCmpCell${featured}`;
}

function BrandMark({
  mark,
  logo,
  featured,
  size = "md",
}: {
  mark: string;
  logo?: CompareLogo | undefined;
  featured?: boolean | undefined;
  size?: "md" | "sm";
}) {
  const toneClass = logo?.tone ? ` vpsCmpMarkTone-${logo.tone}` : "";
  const featuredClass = featured ? " vpsCmpMarkFeatured" : "";
  const rootClass =
    size === "sm"
      ? `vpsCmpSaveMark${toneClass}`
      : `vpsCmpMark${featuredClass}${toneClass}`;
  const imgClass = size === "sm" ? "vpsCmpSaveLogo" : "vpsCmpLogo";
  const px = size === "sm" ? 14 : 24;

  if (logo) {
    return (
      <span className={rootClass}>
        <Image
          className={imgClass}
          src={logo.src}
          alt=""
          width={px}
          height={px}
          unoptimized
          aria-hidden
        />
        <span className="sr-only">{logo.alt}</span>
      </span>
    );
  }

  return (
    <span className={rootClass} aria-hidden>
      {mark}
    </span>
  );
}

function CheaperCell({ provider }: { provider: CompareProvider }) {
  if (provider.featured) {
    return (
      <span className="vpsCmpCheaper vpsCmpCheaperYes">
        <Check className="vpsCmpCheaperIcon" strokeWidth={2.5} aria-hidden />
        {VPS_COMPETITOR_COMPARE.cheapestLabel}
      </span>
    );
  }

  return (
    <span className="vpsCmpCheaper vpsCmpCheaperNo">
      <X className="vpsCmpCheaperIcon" strokeWidth={2.5} aria-hidden />
      {VPS_COMPETITOR_COMPARE.notCheaperLabel}
    </span>
  );
}

export function VpsCompetitorCompare() {
  const rootRef = useRef<HTMLElement>(null);
  const {
    headingId,
    headingBefore,
    headingAccent,
    headingAfter,
    lead,
    providers,
    metrics,
    savings,
  } = VPS_COMPETITOR_COMPARE;

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (reduce.matches) return;

      const header = root.querySelector("[data-vps-cmp-header]");
      const table = root.querySelector("[data-vps-cmp-table]");
      const cards = root.querySelectorAll("[data-vps-cmp-save]");

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
        if (table) {
          tl.from(table, { autoAlpha: 0, y: 28, duration: 0.6 }, 0.12);
        }
        if (cards.length) {
          tl.from(
            cards,
            { autoAlpha: 0, y: 18, duration: 0.45, stagger: 0.08 },
            0.28,
          );
        }
      }, root);

      return () => ctx.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="vpsCmp"
      id="vps-compare"
      aria-labelledby={headingId}
    >
      <div className="vpsCmpInner">
        <header className="vpsCmpHeader" data-vps-cmp-header>
          <h2 id={headingId} className="vpsCmpHeading">
            {headingBefore}
            <span className="vpsCmpHeadingAccent">{headingAccent}</span>
            {headingAfter}
          </h2>
          <p className="vpsCmpLead">{lead}</p>
        </header>

        <div className="vpsCmpTableWrap" data-vps-cmp-table>
          <table className="vpsCmpTable">
            <caption>VPS plan comparison: RunRacks vs competitors</caption>
            <thead>
              <tr>
                <th scope="col" className="vpsCmpMetric">
                  <span className="sr-only">Metric</span>
                </th>
                {providers.map((provider) => (
                  <th
                    key={provider.id}
                    scope="col"
                    className={
                      provider.featured
                        ? "vpsCmpTh vpsCmpCol vpsCmpColFeatured"
                        : "vpsCmpTh vpsCmpCol"
                    }
                  >
                    <div className="vpsCmpBrandHead">
                      {provider.badge ? (
                        <span className="vpsCmpBadge">{provider.badge}</span>
                      ) : (
                        <span className="vpsCmpBadgeSpacer" aria-hidden />
                      )}
                      <BrandMark
                        mark={provider.mark}
                        logo={provider.logo}
                        featured={provider.featured}
                      />
                      <span className="vpsCmpBrandName">{provider.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => (
                <tr key={metric.key}>
                  <th scope="row" className="vpsCmpMetric">
                    {metric.label}
                  </th>
                  {providers.map((provider) => (
                    <td
                      key={`${provider.id}-${metric.key}`}
                      className={
                        provider.featured
                          ? "vpsCmpTd vpsCmpColFeatured"
                          : "vpsCmpTd"
                      }
                    >
                      {metric.key === "cheaper" ? (
                        <CheaperCell provider={provider} />
                      ) : (
                        <span className={cellClass(provider, metric.key)}>
                          {metricValue(provider, metric.key)}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="vpsCmpSavings" aria-label="Annual savings">
          {savings.map((item) => (
            <article
              key={item.providerId}
              className="vpsCmpSaveCard"
              data-vps-cmp-save
            >
              <p className="vpsCmpSaveVs">
                <span>vs</span>
                <BrandMark mark="" logo={item.logo} size="sm" />
                <span>{item.name}</span>
              </p>
              <p className="vpsCmpSaveAmount">{item.amountLabel}</p>
              <p className="vpsCmpSaveNote">{item.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
