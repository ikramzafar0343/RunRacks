/**
 * Decorative SVG panels for benefit cards — not live metrics.
 */
type ArtKind = "compute" | "backup" | "terminal";

export function PhBenefitArt({ kind }: { kind: ArtKind }) {
  if (kind === "compute") {
    return (
      <svg
        className="phBenefitArt"
        viewBox="0 0 320 140"
        role="img"
        aria-label="Decorative compute chart"
      >
        <rect width="320" height="140" rx="8" fill="var(--ph-raised)" />
        <rect
          x="32"
          y="88"
          width="40"
          height="28"
          rx="4"
          fill="var(--ph-primary)"
          opacity="0.35"
        />
        <rect
          x="88"
          y="64"
          width="40"
          height="52"
          rx="4"
          fill="var(--ph-primary)"
          opacity="0.55"
        />
        <rect
          x="144"
          y="40"
          width="40"
          height="76"
          rx="4"
          fill="var(--ph-primary)"
        />
        <rect
          x="200"
          y="56"
          width="40"
          height="60"
          rx="4"
          fill="var(--ph-accent)"
          opacity="0.85"
        />
        <rect
          x="256"
          y="72"
          width="40"
          height="44"
          rx="4"
          fill="var(--ph-primary)"
          opacity="0.45"
        />
      </svg>
    );
  }

  if (kind === "backup") {
    return (
      <svg
        className="phBenefitArt"
        viewBox="0 0 320 140"
        role="img"
        aria-label="Decorative backup illustration"
      >
        <rect width="320" height="140" rx="8" fill="var(--ph-raised)" />
        <circle
          cx="160"
          cy="70"
          r="42"
          fill="none"
          stroke="var(--ph-primary)"
          strokeWidth="8"
          opacity="0.25"
        />
        <path
          d="M160 36a34 34 0 0 1 34 34"
          fill="none"
          stroke="var(--ph-primary)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M186 58l14-2-2 14"
          fill="none"
          stroke="var(--ph-accent)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="148"
          y="58"
          width="24"
          height="28"
          rx="3"
          fill="var(--ph-primary)"
        />
      </svg>
    );
  }

  return (
    <svg
      className="phBenefitArt"
      viewBox="0 0 320 140"
      role="img"
      aria-label="Decorative terminal illustration"
    >
      <rect width="320" height="140" rx="8" fill="var(--ph-raised)" />
      <rect
        x="28"
        y="28"
        width="264"
        height="84"
        rx="6"
        fill="var(--ph-surface)"
        stroke="var(--ph-border)"
      />
      <circle cx="48" cy="46" r="4" fill="var(--ph-primary)" opacity="0.5" />
      <circle cx="62" cy="46" r="4" fill="var(--ph-accent)" opacity="0.7" />
      <circle cx="76" cy="46" r="4" fill="var(--ph-primary)" opacity="0.35" />
      <text
        x="44"
        y="78"
        fill="var(--ph-primary)"
        fontFamily="ui-monospace, monospace"
        fontSize="14"
      >
        $ ssh user@vps
      </text>
      <text
        x="44"
        y="98"
        fill="var(--ph-muted)"
        fontFamily="ui-monospace, monospace"
        fontSize="12"
      >
        connected
      </text>
    </svg>
  );
}
