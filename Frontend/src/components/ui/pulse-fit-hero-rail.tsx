"use client";

/**
 * Scrolling program cards for PulseFitHero — reduced-motion safe.
 */
import { motion } from "framer-motion";
import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type PulseFitProgramCard = {
  image: string;
  category: string;
  title: string;
  href?: Route;
  onClick?: () => void;
};

export function PulseFitProgramsRail({
  programs,
  motionOff,
}: {
  programs: PulseFitProgramCard[];
  motionOff: boolean;
}) {
  const loop = [...programs, ...programs];
  const travel = (programs.length * 380) / 2;

  return (
    <motion.div
      initial={motionOff ? false : { opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay: 0.35 }}
      className="relative z-10 w-full overflow-hidden py-12"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--color-canvas)] to-transparent sm:w-36"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--color-canvas)] to-transparent sm:w-36"
        aria-hidden
      />
      <motion.div
        className="flex items-center gap-6 pl-6"
        {...(motionOff
          ? {}
          : {
              animate: { x: [0, -travel] },
              transition: {
                x: {
                  repeat: Infinity,
                  repeatType: "loop" as const,
                  duration: Math.max(programs.length * 3, 12),
                  ease: "linear" as const,
                },
              },
            })}
      >
        {loop.map((program, index) => (
          <ProgramCard key={`${program.title}-${index}`} program={program} />
        ))}
      </motion.div>
    </motion.div>
  );
}

function ProgramCard({ program }: { program: PulseFitProgramCard }) {
  const body = (
    <>
      <Image
        src={program.image}
        alt={program.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        sizes="356px"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, color-mix(in srgb, #082615 72%, transparent) 100%)",
        }}
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/80">
          {program.category}
        </span>
        <h3 className="text-2xl font-semibold leading-snug text-white">
          {program.title}
        </h3>
      </div>
    </>
  );

  const shell =
    "group relative h-[min(480px,58vw)] w-[min(356px,78vw)] flex-shrink-0 overflow-hidden rounded-2xl shadow-[0_8px_32px_color-mix(in_srgb,var(--color-heading)_12%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--color-brand)]";

  if (program.href) {
    return (
      <Link
        href={program.href}
        className={shell}
        {...(program.onClick ? { onClick: program.onClick } : {})}
      >
        {body}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(shell, "cursor-pointer text-left")}
      {...(program.onClick ? { onClick: program.onClick } : {})}
    >
      {body}
    </button>
  );
}
