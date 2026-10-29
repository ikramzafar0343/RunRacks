/**
 * Post-pricing clarity strip — centered scroll-fill headline + 4 cards.
 */
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { ChartPie, KeyRound, Sparkles } from "lucide-react";
import { AdminRdpUsaClarityHeading } from "@/features/admin-rdp-usa/components/AdminRdpUsaClarityHeading";
import {
  ADMIN_RDP_USA_CLARITY,
  type ClarityFeatureIcon,
} from "@/features/admin-rdp-usa/model/adminRdpUsaClarity";
import "@/features/admin-rdp-usa/components/admin-rdp-usa-clarity.css";

const ICONS: Record<ClarityFeatureIcon, LucideIcon> = {
  access: KeyRound,
  dashboard: ChartPie,
  insights: Sparkles,
};

export function AdminRdpUsaClarity() {
  const { headingId, visual, features } = ADMIN_RDP_USA_CLARITY;

  return (
    <section
      id="admin-rdp-usa-clarity"
      className="ardpClarity"
      aria-labelledby={headingId}
    >
      <div className="ardpClarityInner">
        <AdminRdpUsaClarityHeading />

        <div className="ardpClarityGrid">
          <article
            className="ardpClarityCard ardpClarityCard--visual"
            aria-label={visual.alt}
          >
            <Image
              src={visual.src}
              alt={visual.alt}
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
              className="ardpClarityVisual"
            />
          </article>

          {features.map((card) => {
            const Icon = ICONS[card.id];
            return (
              <article
                key={card.id}
                className={`ardpClarityCard ardpClarityCard--${card.tone}`}
              >
                <span className="ardpClarityMark" aria-hidden>
                  <Icon strokeWidth={1.15} />
                </span>
                <h3 className="ardpClarityCardTitle">{card.title}</h3>
                <p className="ardpClarityCardBody">{card.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
