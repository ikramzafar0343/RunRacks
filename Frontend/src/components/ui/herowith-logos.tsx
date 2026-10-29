"use client";

/**
 * Hero with logo marquee — Sage & Ink adaptation of 21st.dev herowith-logos.
 * Bottom floor: interactive Cobe globe (catalog region pins, no fake analytics).
 */
import Link from "next/link";
import type { Route } from "next";
import {
  GlobeAnalytics,
  type GlobeMarker,
} from "@/components/ui/cobe-globe-analytics";
import { cn } from "@/lib/utils";

export type HeroWithLogosLogo = {
  name: string;
  src: string;
};

export type HeroWithLogosCta = {
  label: string;
  href: Route | (string & {});
};

export type HeroWithLogosProps = {
  badge?: string;
  title: string;
  subtitle: string;
  primaryCta: HeroWithLogosCta;
  secondaryCta: HeroWithLogosCta;
  logos: readonly HeroWithLogosLogo[];
  logosNotice?: string;
  /** Catalog region pins for the Cobe globe under the logo strip. */
  globeMarkers?: readonly GlobeMarker[];
  className?: string;
};

function AnimatedLogoCloud({
  logos,
  notice,
}: {
  logos: readonly HeroWithLogosLogo[];
  notice?: string;
}) {
  if (logos.length === 0) return null;

  return (
    <div className="heroLogosCloud relative z-20 w-full pt-8 md:pt-10">
      <div className="mx-auto w-full max-w-[90rem] px-4 md:px-8">
        {notice ? (
          <p className="mb-6 text-center text-xs tracking-wide text-[var(--color-muted)] md:mb-8 md:text-sm">
            {notice}
          </p>
        ) : null}
        <div
          className="group relative flex gap-10 overflow-hidden py-3 md:gap-14"
          style={{
            maskImage:
              "linear-gradient(to left, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to left, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <div
              key={index}
              className="heroLogosTrack flex shrink-0 flex-row items-center justify-around gap-10 md:gap-14"
              aria-hidden={index > 0 ? true : undefined}
            >
              {logos.map((logo) => (
                // eslint-disable-next-line @next/next/no-img-element -- local brand PNGs; match logo-cloud pattern
                <img
                  key={`${index}-${logo.name}`}
                  src={logo.src}
                  className="logoCloudImg heroLogoMark h-14 w-40 flex-none object-contain sm:h-16 sm:w-48 md:h-[4.75rem] md:w-56 lg:h-20 lg:w-64"
                  alt={index === 0 ? logo.name : ""}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroWithLogos({
  badge,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  logos,
  logosNotice,
  globeMarkers,
  className,
}: HeroWithLogosProps) {
  return (
    <section
      className={cn(
        "heroWithLogos relative min-h-[calc(100vh-50px)] overflow-hidden font-sans",
        className,
      )}
      aria-labelledby="hero-with-logos-title"
      style={{
        backgroundImage: "var(--gradient-hero)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
      }}
    >
      <div
        className="absolute left-0 top-0 z-0 grid h-full w-full grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)] border-b border-[var(--color-border)]"
        aria-hidden
      >
        <div className="col-span-1 flex h-full items-center justify-center" />
        <div className="col-span-1 flex h-full items-center justify-center border-x border-[color-mix(in_srgb,var(--color-heading)_10%,transparent)]" />
        <div className="col-span-1 flex h-full items-center justify-center" />
      </div>
      <figure
        className="pointer-events-none absolute left-[4vw] top-[64px] z-0 hidden aspect-square w-[32vw] rounded-full bg-[color-mix(in_srgb,var(--color-brand)_16%,transparent)] opacity-50 blur-[100px] md:block"
        aria-hidden
      />
      <figure
        className="pointer-events-none absolute right-[7vw] top-[40%] z-0 hidden aspect-square w-[30vw] rounded-full bg-[color-mix(in_srgb,var(--color-brand)_28%,transparent)] opacity-40 blur-[100px] md:block"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[calc(100vh-50px)] flex-col divide-y divide-[color-mix(in_srgb,var(--color-heading)_10%,transparent)] pt-[clamp(5.5rem,12vw,8rem)]">
        {badge ? (
          <div className="flex flex-col items-center justify-end">
            <div className="flex items-center gap-2 border border-b-0 border-[color-mix(in_srgb,var(--color-heading)_8%,transparent)] px-4 py-2">
              <p className="text-sm tracking-tight text-[var(--color-muted)]">
                {badge}
              </p>
            </div>
          </div>
        ) : null}

        <div>
          <div className="mx-auto flex min-h-[240px] max-w-[80vw] shrink-0 flex-col items-center justify-center gap-3 px-2 py-6 sm:min-h-[288px] sm:px-10 lg:px-24">
            <h1
              id="hero-with-logos-title"
              className="max-w-screen-lg text-pretty text-center text-4xl font-medium leading-none tracking-[-1.44px] text-[var(--color-heading)] sm:text-5xl md:text-6xl md:tracking-[-2.16px] lg:text-[clamp(50px,7vw,75px)]"
            >
              {title}
            </h1>
            <p className="max-w-2xl text-pretty text-center text-base text-[var(--color-muted)] md:text-lg">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-start justify-center px-8 sm:px-24">
          <div className="flex w-full max-w-[80vw] flex-col items-center justify-start md:max-w-[392px]">
            <Link
              href={secondaryCta.href as Route}
              className="flex h-14 w-full cursor-pointer items-center justify-center border-x border-[color-mix(in_srgb,var(--color-heading)_12%,transparent)] bg-transparent text-base text-[var(--color-heading)] backdrop-blur-xl transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--color-heading)_5%,transparent)]"
            >
              {secondaryCta.label}
            </Link>
            <Link
              href={primaryCta.href as Route}
              className="flex h-14 w-full cursor-pointer items-center justify-center border-none bg-[var(--color-lime)] text-base font-semibold text-[var(--color-on-lime)] transition-colors duration-150 hover:bg-[color-mix(in_srgb,var(--color-lime)_88%,#fff)]"
            >
              {primaryCta.label}
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-7xl">
          <AnimatedLogoCloud
            logos={logos}
            {...(logosNotice ? { notice: logosNotice } : {})}
          />
        </div>

        {globeMarkers && globeMarkers.length > 0 ? (
          <div className="heroMapFloor relative z-[5] mt-4 w-full overflow-hidden border-t-0 pt-2 md:mt-6">
            <div className="heroMapFloorInner mx-auto w-full max-w-none px-0">
              <GlobeAnalytics
                markers={globeMarkers}
                className="heroCobeGlobe"
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default HeroWithLogos;
