/**
 * Inline SVGs for Admin RDP power feature rows (currentColor).
 */
import type { ReactNode } from "react";

export type ArdpPowerIconId = "cpu" | "kvm" | "shield" | "network";

type IconProps = { size?: number };

function CpuIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="7"
        y="7"
        width="10"
        height="10"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <rect x="10" y="10" width="4" height="4" rx="0.5" fill="currentColor" />
      <path
        d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function KvmIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="2.4" fill="currentColor" />
      <circle cx="12" cy="5" r="1.7" stroke="currentColor" strokeWidth="1.5" />
      <circle
        cx="5.5"
        cy="17"
        r="1.7"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle
        cx="18.5"
        cy="17"
        r="1.7"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 9.6V6.8M10.1 13.4 6.8 16M13.9 13.4l3.3 2.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.5 5.5 6.2v5.1c0 4.1 2.7 7.1 6.5 8.7 3.8-1.6 6.5-4.6 6.5-8.7V6.2L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m9.2 12 1.8 1.8 3.8-3.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NetworkIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="16"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 19h6M12 15v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M7 8.5h3M7 11h5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ICONS: Record<ArdpPowerIconId, (props: IconProps) => ReactNode> = {
  cpu: CpuIcon,
  kvm: KvmIcon,
  shield: ShieldIcon,
  network: NetworkIcon,
};

export function ardpPowerIcon(id: ArdpPowerIconId, size = 18): ReactNode {
  const Icon = ICONS[id];
  return Icon({ size });
}

/** Decorative AMD + NVMe schematic for the power panel. */
export function ArdpPowerSchematic() {
  return (
    <svg
      className="ardpPowerArtSvg"
      viewBox="0 0 420 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <pattern
          id="ardpPowerGrid"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M28 0H0V28"
            stroke="currentColor"
            strokeOpacity="0.14"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="420" height="380" fill="url(#ardpPowerGrid)" />
      <path
        d="M40 40 L380 40 L380 340 L40 340 Z"
        stroke="currentColor"
        strokeOpacity="0.12"
        strokeWidth="1"
        strokeDasharray="4 6"
      />
      {/* AMD tile */}
      <rect
        x="78"
        y="58"
        width="220"
        height="200"
        rx="10"
        className="ardpPowerArtTile"
      />
      <rect
        x="78"
        y="58"
        width="220"
        height="200"
        rx="10"
        className="ardpPowerArtTileStroke"
      />
      <text
        x="188"
        y="168"
        textAnchor="middle"
        className="ardpPowerArtLabel"
        fontSize="42"
        fontWeight="800"
      >
        AMD
      </text>
      {/* Connector */}
      <path
        d="M188 258 V292"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      {/* NVMe tile */}
      <rect
        x="118"
        y="292"
        width="140"
        height="58"
        rx="8"
        className="ardpPowerArtTile"
      />
      <rect
        x="118"
        y="292"
        width="140"
        height="58"
        rx="8"
        className="ardpPowerArtTileStroke"
      />
      <text
        x="188"
        y="328"
        textAnchor="middle"
        className="ardpPowerArtLabel"
        fontSize="16"
        fontWeight="700"
      >
        NVMe SSD
      </text>
    </svg>
  );
}
