export type WorldMapPoint = {
  lat: number;
  lng: number;
  label?: string;
  /** ISO 3166-1 alpha-2 — renders `/flags/{code}.svg` in the label pill. */
  flagCode?: string;
  /** Pixel nudge for the label box (viewBox 800×400). */
  labelDx?: number;
  labelDy?: number;
};

export type WorldMapDot = {
  start: WorldMapPoint;
  end: WorldMapPoint;
};

export type WorldMapProps = {
  dots?: WorldMapDot[];
  lineColor?: string;
  showLabels?: boolean;
  labelClassName?: string;
  animationDuration?: number;
  loop?: boolean;
  className?: string;
};

export const SAGE_LIME = "#c8f135";
export const SAGE_BRAND = "#34745a";
