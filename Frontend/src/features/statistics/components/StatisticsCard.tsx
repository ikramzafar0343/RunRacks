"use client";

/**
 * Single infrastructure statistic card.
 */
import type { ReactNode } from "react";
import { StatisticHelpTooltip } from "@/features/statistics/components/StatisticHelpTooltip";
import { StatisticIcon } from "@/features/statistics/components/StatisticIcons";
import type { StatCardId } from "@/features/statistics/model/types";

export type StatMetricBlock = {
  value: string;
  description: string;
};

export type StatisticsCardProps = {
  id: StatCardId;
  label: string;
  help: string;
  primary: StatMetricBlock;
  secondary?: StatMetricBlock;
  footerLines?: string[];
  badge?: string | null;
  footerGlyph?: ReactNode;
  /** Which footer line shows `footerGlyph` (default 0). */
  footerGlyphIndex?: number;
};

export function StatisticsCard({
  id,
  label,
  help,
  primary,
  secondary,
  footerLines = [],
  badge,
  footerGlyph,
  footerGlyphIndex = 0,
}: StatisticsCardProps) {
  return (
    <article className="statsCard" data-stat={id}>
      <div className="statsCardTop">
        <div className="statsCardLabelRow">
          <h3 className="statsCardLabel">{label}</h3>
          <StatisticHelpTooltip label={label} description={help} />
        </div>
        <StatisticIcon id={id} className="statsCardIcon" />
      </div>

      <div className="statsCardBody">
        <p className="statsCardValue">{primary.value}</p>
        <p className="statsCardDesc">{primary.description}</p>

        {secondary ? (
          <div className="statsCardSecondary">
            <p className="statsCardValue">{secondary.value}</p>
            <p className="statsCardDesc">{secondary.description}</p>
          </div>
        ) : null}

        {footerLines.length > 0 || badge || footerGlyph ? (
          <div className="statsCardFooter">
            {footerLines.map((line, index) => (
              <p key={line} className="statsCardMeta">
                {footerGlyph && index === footerGlyphIndex ? (
                  <span className="statsCardMetaGlyph" aria-hidden>
                    {footerGlyph}
                  </span>
                ) : null}
                {line}
              </p>
            ))}
            {badge ? <span className="statsCardBadge">{badge}</span> : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
