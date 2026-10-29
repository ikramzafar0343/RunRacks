"use client";

/**
 * PulseFit-style hero — adapted for RunRacks (Sage & Ink / Nourd).
 * Default showChrome=false so global SiteHeader stays the only nav.
 */
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  PulseFitProgramsRail,
  type PulseFitProgramCard,
} from "@/components/ui/pulse-fit-hero-rail";
import { cn } from "@/lib/utils";

export type { PulseFitProgramCard };

export type PulseFitNavItem = {
  label: string;
  hasDropdown?: boolean;
  onClick?: () => void;
};

export type PulseFitAction = {
  label: string;
  href?: Route;
  onClick?: () => void;
};

export type PulseFitHeroProps = {
  /** When false (default), omit logo/nav/header CTA. */
  showChrome?: boolean;
  logo?: string;
  brand?: string;
  navigation?: PulseFitNavItem[];
  ctaButton?: PulseFitAction;
  title: string;
  subtitle: string;
  primaryAction?: PulseFitAction;
  secondaryAction?: PulseFitAction;
  disclaimer?: string;
  programs?: PulseFitProgramCard[];
  atmosphere?: ReactNode;
  className?: string;
  children?: ReactNode;
};

function ActionControl({
  action,
  variant,
}: {
  action: PulseFitAction;
  variant: "primary" | "secondary" | "chrome";
}) {
  const className = cn(
    "inline-flex items-center justify-center gap-2 rounded-md px-7 py-3.5 text-base font-semibold transition-[transform,background,border-color] duration-200 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-brand)]",
    variant === "primary" &&
      "bg-[var(--color-lime)] text-[var(--color-on-lime)] shadow-sm",
    variant === "secondary" &&
      "border border-[color-mix(in_srgb,var(--color-heading)_22%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_55%,transparent)] text-[var(--color-heading)] hover:border-[var(--color-brand)]",
    variant === "chrome" &&
      "rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm text-[var(--color-heading)] shadow-sm",
  );

  const inner = (
    <>
      {action.label}
      {variant === "primary" ? (
        <ArrowRight className="size-5" aria-hidden strokeWidth={2} />
      ) : null}
    </>
  );

  if (action.href) {
    return (
      <Link
        href={action.href}
        className={className}
        {...(action.onClick ? { onClick: action.onClick } : {})}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      {...(action.onClick ? { onClick: action.onClick } : {})}
    >
      {inner}
    </button>
  );
}

export function PulseFitHero({
  showChrome = false,
  logo = "RunRacks",
  brand,
  navigation = [],
  ctaButton,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  disclaimer,
  programs = [],
  atmosphere,
  className,
  children,
}: PulseFitHeroProps) {
  const reduceMotion = useReducedMotion();
  const motionOff = reduceMotion === true;

  return (
    <section
      className={cn(
        "pulseFitHero relative flex min-h-[min(92vh,52rem)] w-full flex-col overflow-hidden bg-[var(--color-canvas)] font-sans text-[var(--color-body)]",
        className,
      )}
      aria-label="Hero section"
    >
      {atmosphere ? (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          {atmosphere}
        </div>
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-canvas)_55%,transparent)_0%,color-mix(in_srgb,var(--color-canvas)_20%,transparent)_40%,color-mix(in_srgb,var(--color-canvas)_92%,transparent)_100%),linear-gradient(90deg,color-mix(in_srgb,var(--color-canvas)_90%,transparent)_0%,color-mix(in_srgb,var(--color-canvas)_40%,transparent)_50%,transparent_75%)]"
        aria-hidden
      />

      {showChrome ? (
        <motion.header
          initial={motionOff ? false : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative z-20 flex items-center justify-between px-8 pb-8 pt-8 lg:px-16"
        >
          <div className="text-2xl font-bold text-[var(--color-heading)]">
            {logo}
          </div>
          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="flex items-center gap-1 text-base text-[var(--color-muted)] transition-opacity hover:opacity-70"
              >
                {item.label}
                {item.hasDropdown ? (
                  <ChevronDown className="size-4" aria-hidden />
                ) : null}
              </button>
            ))}
          </nav>
          {ctaButton ? (
            <ActionControl action={ctaButton} variant="chrome" />
          ) : (
            <span className="w-24" aria-hidden />
          )}
        </motion.header>
      ) : null}

      {children ? (
        <div className="relative z-10 flex flex-1 items-center justify-center">
          {children}
        </div>
      ) : (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-6 pt-[clamp(5.5rem,12vw,8rem)]">
          <motion.div
            initial={motionOff ? false : { opacity: 0.92, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12 }}
            className="flex max-w-3xl flex-col items-center gap-7 text-center"
          >
            {brand ? (
              <p className="text-[clamp(1.75rem,4.5vw,2.75rem)] font-bold leading-none tracking-[-0.03em] text-[var(--color-heading)]">
                {brand}
              </p>
            ) : null}
            <h1 className="text-[clamp(1.5rem,3.2vw,2.35rem)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--color-heading)]">
              {title}
            </h1>
            <p className="max-w-xl text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed text-[var(--color-body)]">
              {subtitle}
            </p>
            {(primaryAction || secondaryAction) && (
              <motion.div
                initial={motionOff ? false : { opacity: 0.92, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.28 }}
                className="flex flex-col items-center gap-3 sm:flex-row"
              >
                {primaryAction ? (
                  <ActionControl action={primaryAction} variant="primary" />
                ) : null}
                {secondaryAction ? (
                  <ActionControl action={secondaryAction} variant="secondary" />
                ) : null}
              </motion.div>
            )}
            {disclaimer ? (
              <p className="text-[0.8125rem] italic text-[var(--color-muted)]">
                {disclaimer}
              </p>
            ) : null}
          </motion.div>
        </div>
      )}

      {programs.length > 0 ? (
        <PulseFitProgramsRail programs={programs} motionOff={motionOff} />
      ) : null}
    </section>
  );
}
