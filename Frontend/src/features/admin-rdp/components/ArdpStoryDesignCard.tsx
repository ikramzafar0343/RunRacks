"use client";

/**
 * Editorial motion card for ArdpStoryDesign with overlapping portrait and motion layers.
 * Follows RunRacks Sage & Ink design tokens with proper light & dark theme styling.
 */
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ArdpStoryDesignCardProps {
  position?: "left" | "right";
  eyebrow?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  imageUrl?: string;
  primaryCopy?: string;
  secondaryCopy?: string;
  className?: string;
  ctaHref?: string;
  ctaAriaLabel?: string;
  onCtaClick?: () => void;
}

export function ArdpStoryDesignCard({
  position = "left",
  eyebrow = "+ ( Access built for operators )",
  titlePrefix = "Hands-on",
  titleHighlight = "Windows Control",
  imageUrl = "/images/admin-rdp/team.jpg",
  primaryCopy,
  secondaryCopy,
  className,
  ctaHref = "#vps-plans",
  ctaAriaLabel = "Explore Admin RDP plans",
  onCtaClick,
}: ArdpStoryDesignCardProps) {
  const isPositionRight = position === "right";
  const fullName = `${titlePrefix} ${titleHighlight}`.trim();

  const ctaContent = (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={onCtaClick}
      className={cn(
        "group flex h-9 w-9 min-[380px]:h-11 min-[380px]:w-11 sm:h-14 sm:w-14 md:h-20 md:w-20 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-300",
        // Light theme: white surface with border, Sage brand hover
        "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-heading)]",
        "shadow-[0_4px_14px_color-mix(in_srgb,var(--color-heading)_8%,transparent)]",
        "hover:border-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-[var(--color-brand-contrast)]",
        "hover:shadow-[0_8px_24px_color-mix(in_srgb,var(--color-brand)_28%,transparent)]",
        // Dark theme: translucent surface, lime hover
        "dark:border-[color-mix(in_srgb,var(--color-heading)_22%,transparent)]",
        "dark:bg-[color-mix(in_srgb,var(--color-surface)_70%,transparent)]",
        "dark:text-[var(--color-heading)]",
        "dark:hover:border-[var(--color-lime)] dark:hover:bg-[var(--color-lime)] dark:hover:text-[var(--color-on-lime)]",
        "dark:hover:shadow-[0_0_24px_color-mix(in_srgb,var(--color-lime)_35%,transparent)]",
        isPositionRight && "order-1",
      )}
      role={ctaHref ? undefined : "button"}
      tabIndex={ctaHref ? undefined : 0}
      aria-label={ctaAriaLabel}
    >
      <ArrowRight
        className={cn(
          "w-3.5 h-3.5 min-[380px]:w-4 min-[380px]:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transition-all duration-300 group-hover:-rotate-45",
          isPositionRight && "rotate-180 group-hover:rotate-225",
        )}
      />
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative my-6 sm:my-10 md:my-16 flex flex-col justify-center",
        className,
      )}
    >
      {/* Eyebrow label — editorial uppercase tracking */}
      <motion.div
        initial={{ opacity: 0, x: isPositionRight ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p
          className={cn(
            "mb-3 sm:mb-4 text-[10px] sm:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.25em] uppercase",
            "text-[var(--color-brand)] dark:text-[var(--color-lime)]",
            isPositionRight && "text-right",
          )}
        >
          {eyebrow}
        </p>
      </motion.div>

      <div
        className={cn(
          "flex flex-row items-stretch md:items-center",
          isPositionRight ? "justify-start" : "justify-end",
        )}
      >
        {/* Portrait image with reveal animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "relative w-[34%] min-w-[115px] max-w-[150px] sm:w-[38%] sm:max-w-[240px] md:w-90 md:max-w-none shrink-0 overflow-hidden rounded-none",
            "self-stretch md:self-auto h-auto md:h-125 min-h-[280px]",
            "border border-[var(--color-border)] dark:border-[color-mix(in_srgb,var(--color-heading)_15%,transparent)]",
            "shadow-[0_16px_36px_-10px_color-mix(in_srgb,var(--color-heading)_10%,transparent)] dark:shadow-[0_20px_48px_-12px_rgba(0,0,0,0.5)]",
            isPositionRight && "order-1",
          )}
        >
          {/* Subtle grain / depth overlay for texture */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[color-mix(in_srgb,var(--color-heading)_25%,transparent)] via-transparent to-transparent dark:from-black/40" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={fullName}
            className="h-full w-full object-cover duration-500 ease-[0.22,1,0.36,1] hover:scale-105"
          />
        </motion.div>

        {/* Info block — overlaps image via negative margin */}
        <motion.div
          initial={{ opacity: 0, x: isPositionRight ? -40 : 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "relative z-2 flex flex-1 min-w-0 md:w-[calc(100%-350px)] md:flex-initial flex-col justify-center gap-2.5 min-[380px]:gap-3.5 sm:gap-6 md:gap-12 py-3 min-[380px]:py-4 md:py-0",
            isPositionRight
              ? "left-3 sm:left-5 md:left-8 items-end"
              : "-left-3 sm:-left-5 md:-left-8",
          )}
        >
          {/* Display title — large editorial type */}
          <div>
            <h3
              className={cn(
                "text-lg min-[360px]:text-xl min-[400px]:text-2xl sm:text-4xl md:text-6xl leading-[1.08] font-extralight tracking-tight",
                "text-[var(--color-heading)]",
                isPositionRight && "text-right",
              )}
            >
              {titlePrefix}
              <br />
              <span className="font-normal">{titleHighlight}</span>
            </h3>
          </div>

          {/* Details row — CTA + story copy */}
          <div
            className={cn(
              "flex flex-row gap-2 min-[380px]:gap-3 sm:gap-5 md:gap-8 items-start",
              isPositionRight && "justify-end",
            )}
          >
            {ctaHref ? (
              <a
                href={ctaHref}
                className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
              >
                {ctaContent}
              </a>
            ) : (
              ctaContent
            )}

            {/* Story copy — restrained body text */}
            <div
              className={cn(
                "flex-1 min-w-0 md:w-full md:max-w-md space-y-1.5 min-[380px]:space-y-2 sm:space-y-2.5 md:space-y-3.5",
                isPositionRight && "text-right",
              )}
            >
              {primaryCopy ? (
                <p className="text-[10px] min-[360px]:text-[11px] min-[400px]:text-xs sm:text-sm md:text-base leading-[1.5] min-[380px]:leading-[1.6] md:leading-[1.8] text-[var(--color-body)] font-normal">
                  {primaryCopy}
                </p>
              ) : null}
              {secondaryCopy ? (
                <p className="text-[9px] min-[360px]:text-[10px] min-[400px]:text-[11px] sm:text-xs md:text-sm leading-[1.5] min-[380px]:leading-[1.6] md:leading-[1.8] text-[var(--color-muted)] font-normal">
                  {secondaryCopy}
                </p>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
