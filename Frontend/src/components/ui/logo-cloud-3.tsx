import Image from "next/image";
import { cn } from "@/lib/utils";

export interface LogoItem {
  src: string;
  alt: string;
}

interface LogoCloudProps {
  logos: readonly LogoItem[];
  className?: string;
}

export function LogoCloud({ logos, className }: LogoCloudProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 items-center justify-items-center gap-6 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8",
        className,
      )}
    >
      {logos.map((logo) => (
        <div
          key={logo.alt}
          className="flex h-12 w-full items-center justify-center rounded-lg border border-border/60 bg-surface/90 px-3 py-2 shadow-2xs transition-all duration-200 hover:border-brand/40 hover:bg-surface hover:shadow-xs dark:bg-white/90 dark:border-white/10 dark:hover:bg-white"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={100}
            height={28}
            className="logoCloudImg max-h-6 w-auto max-w-[90px] object-contain opacity-80 grayscale contrast-125 hover:opacity-100 hover:grayscale-0"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}
