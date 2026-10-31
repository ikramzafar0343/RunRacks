import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { PricingTrustBand } from "@/components/ui/pricing-trust-band";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-visible">
      {/* Hero Ambient Background Box */}
      <div className="relative w-full overflow-visible border-b border-border/40 bg-[radial-gradient(ellipse_70%_55%_at_50%_52%,color-mix(in_srgb,var(--color-brand)_14%,transparent),transparent_70%),linear-gradient(180deg,var(--color-canvas)_0%,color-mix(in_srgb,var(--color-surface)_70%,var(--color-canvas))_35%,color-mix(in_srgb,var(--color-brand)_16%,var(--color-canvas))_75%,color-mix(in_srgb,var(--color-brand)_10%,var(--color-surface))_100%)] pt-14 pb-38 sm:pb-40 md:pt-18 md:pb-40">
        {/* Top Shades (Sage ambient glow) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 isolate hidden overflow-hidden contain-strict lg:block"
        >
          <div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(40%_80%_at_50%_0%,color-mix(in_srgb,var(--color-brand)_14%,transparent),transparent)] contain-strict" />
        </div>

        {/* X Bold Faded Borders */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mx-auto hidden min-h-[420px] w-full max-w-5xl lg:block"
        >
          <div className="absolute inset-y-0 left-0 z-10 h-full w-px bg-gradient-to-b from-transparent via-border/70 to-transparent" />
          <div className="absolute inset-y-0 right-0 z-10 h-full w-px bg-gradient-to-b from-transparent via-border/70 to-transparent" />
        </div>

        {/* Main Content */}
        <div className="relative mx-auto flex max-w-5xl flex-col items-center justify-center gap-5 px-4 text-center sm:px-6">
          {/* X Content Faded Borders */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-1 size-full overflow-hidden"
          >
            <div className="absolute inset-y-0 left-4 w-px bg-gradient-to-b from-transparent via-border/60 to-transparent md:left-8" />
            <div className="absolute inset-y-0 right-4 w-px bg-gradient-to-b from-transparent via-border/60 to-transparent md:right-8" />
            <div className="absolute inset-y-0 left-8 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent md:left-12" />
            <div className="absolute inset-y-0 right-8 w-px bg-gradient-to-b from-transparent via-border/30 to-transparent md:right-12" />
          </div>

          {/* Hero Heading */}
          <h1
            className={cn(
              "fade-in slide-in-from-bottom-10 animate-in text-balance fill-mode-backwards text-center font-sans font-medium tracking-[-0.045em] leading-[1.05] text-heading delay-200 duration-500 ease-out text-4xl sm:text-5xl md:text-6xl lg:text-[68px]",
              "[text-shadow:0_0_40px_color-mix(in_srgb,var(--color-brand)_18%,transparent)]",
            )}
          >
            Clear plans for VPS, <br className="hidden sm:inline" />
            Windows, and Admin RDP
          </h1>

          {/* Hero Subtitle */}
          <p className="fade-in slide-in-from-bottom-10 mx-auto max-w-2xl animate-in fill-mode-backwards text-center text-base text-body/85 tracking-normal delay-300 duration-500 ease-out sm:text-lg md:text-xl">
            Compare NVMe-backed Linux VPS, Windows VPS, and Admin RDP across
            catalog regions. Full administrator access on every family—demo
            prices are labeled until checkout is connected.
          </p>

          {/* Action Button */}
          <div className="fade-in slide-in-from-bottom-10 flex animate-in items-center justify-center fill-mode-backwards pt-2 delay-500 duration-500 ease-out">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-brand px-8 text-[15px] font-semibold text-brand-contrast shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-lime hover:text-on-lime hover:shadow-[0_10px_28px_color-mix(in_srgb,var(--color-heading)_18%,transparent)] active:translate-y-0 active:shadow-none"
            >
              <a href="#pricing-plans" className="group">
                Explore Plans
                <ArrowRightIcon
                  className="ms-2 size-4 transition-transform duration-200 group-hover:translate-x-1"
                  data-icon="inline-end"
                />
              </a>
            </Button>
          </div>
        </div>

        {/* Floating Statistics & Reviews Card — half inside hero, half outside */}
        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-1/2 px-4">
          <PricingTrustBand />
        </div>
      </div>
    </section>
  );
}
