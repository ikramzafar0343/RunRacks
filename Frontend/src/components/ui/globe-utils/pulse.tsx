import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

/**
 * Ping pulse for SVG globe pins.
 * Uses solid `bg-primary` + opacity (Tailwind `/50` color-mix fails with our CSS var tokens).
 */
export function Pulse({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative flex size-2", className)} {...props}>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-50" />
      <span className="relative inline-flex size-full rounded-full bg-primary opacity-90" />
    </div>
  );
}
