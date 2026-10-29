/**
 * Platforms & Technologies — dual-row logo marquee + scroll-ink heading.
 * Illustrative marks only (not partnership claims).
 * Pack symbols: Font Awesome Free Brands, CC BY 4.0 (Fonticons, Inc.).
 */
import { BrandsHeading } from "@/features/home/components/BrandsHeading";
import { BrandsMarquee } from "@/features/home/components/BrandsMarquee";
import { cn } from "@/lib/utils";
import "@/features/home/components/brands-section.css";

export function BrandsSection({ className }: { className?: string } = {}) {
  return (
    <section
      className={cn("brandsSection", className)}
      aria-labelledby="brands-heading"
    >
      <BrandsHeading />
      <BrandsMarquee />
    </section>
  );
}
