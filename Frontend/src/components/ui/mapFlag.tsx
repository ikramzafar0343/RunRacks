/**
 * Tiny flag mark for WorldMap labels (static /flags SVGs).
 */
type MapFlagProps = {
  code: string;
  size?: "sm" | "md";
};

export function MapFlag({ code, size = "sm" }: MapFlagProps) {
  const dim = size === "md" ? { w: 16, h: 12, cls: "h-3 w-4" } : { w: 14, h: 10, cls: "h-2.5 w-3.5" };
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG foreignObject / tip; static public flags
    <img
      src={`/flags/${code.toLowerCase()}.svg`}
      alt=""
      width={dim.w}
      height={dim.h}
      className={`${dim.cls} shrink-0 rounded-[2px] object-cover`}
      draggable={false}
    />
  );
}
