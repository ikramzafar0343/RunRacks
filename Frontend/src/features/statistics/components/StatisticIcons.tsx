/**
 * Flat line-art infrastructure icons for statistics cards (decorative).
 */
import type { ReactNode } from "react";
import type { StatCardId } from "@/features/statistics/model/types";

type IconProps = {
  className?: string | undefined;
};

function SvgShell({
  className,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className ?? undefined}
      viewBox="0 0 64 64"
      width="64"
      height="64"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function CpuIcon({ className }: IconProps) {
  return (
    <SvgShell className={className}>
      <rect
        x="16"
        y="16"
        width="32"
        height="32"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="24"
        y="24"
        width="16"
        height="16"
        rx="2"
        fill="var(--stats-accent)"
      />
      <path
        d="M22 10v6M32 10v6M42 10v6M22 48v6M32 48v6M42 48v6M10 22h6M10 32h6M10 42h6M48 22h6M48 32h6M48 42h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </SvgShell>
  );
}

export function RamIcon({ className }: IconProps) {
  return (
    <SvgShell className={className}>
      <rect
        x="8"
        y="22"
        width="48"
        height="20"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="14"
        y="28"
        width="7"
        height="8"
        rx="1"
        fill="var(--stats-accent)"
      />
      <rect
        x="24"
        y="28"
        width="7"
        height="8"
        rx="1"
        fill="var(--stats-accent)"
      />
      <rect
        x="34"
        y="28"
        width="7"
        height="8"
        rx="1"
        fill="var(--stats-accent)"
      />
      <rect
        x="44"
        y="28"
        width="7"
        height="8"
        rx="1"
        fill="var(--stats-accent)"
      />
      <path
        d="M12 42v4M20 42v4M44 42v4M52 42v4"
        stroke="currentColor"
        strokeWidth="2"
      />
    </SvgShell>
  );
}

export function TrafficIcon({ className }: IconProps) {
  return (
    <SvgShell className={className}>
      <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="2" />
      <ellipse
        cx="32"
        cy="32"
        rx="8"
        ry="18"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M14 32h36M18 22c6 3 14 3 28 0M18 42c6-3 14-3 28 0"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="22" cy="24" r="2.2" fill="var(--stats-accent)" />
      <circle cx="42" cy="40" r="2.2" fill="var(--stats-accent)" />
      <circle cx="38" cy="20" r="2" fill="var(--stats-accent)" />
    </SvgShell>
  );
}

export function StorageIcon({ className }: IconProps) {
  return (
    <SvgShell className={className}>
      <rect
        x="20"
        y="10"
        width="24"
        height="44"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M24 18h16M24 26h16M24 34h16M24 42h16"
        stroke="var(--stats-accent)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </SvgShell>
  );
}

export function ReadIcon({ className }: IconProps) {
  return (
    <SvgShell className={className}>
      <path
        d="M16 18h18l6 6v24a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V20a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M34 18v6h6" stroke="currentColor" strokeWidth="2" />
      <circle cx="44" cy="44" r="10" fill="var(--stats-accent)" />
      <path
        d="M44 38v10M40 44l4 4 4-4"
        stroke="var(--stats-on-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgShell>
  );
}

export function WriteIcon({ className }: IconProps) {
  return (
    <SvgShell className={className}>
      <path
        d="M16 18h18l6 6v24a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V20a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M34 18v6h6" stroke="currentColor" strokeWidth="2" />
      <circle cx="44" cy="44" r="10" fill="var(--stats-accent)" />
      <path
        d="M44 48V38M40 42l4-4 4 4"
        stroke="var(--stats-on-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgShell>
  );
}

export function PowerIcon({ className }: IconProps) {
  return (
    <SvgShell className={className}>
      <path
        d="M34 8 18 36h12l-2 20 18-30H34l0-18Z"
        fill="var(--stats-accent)"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </SvgShell>
  );
}

const ICONS: Record<StatCardId, (props: IconProps) => ReactNode> = {
  cpu: CpuIcon,
  ram: RamIcon,
  traffic: TrafficIcon,
  storage: StorageIcon,
  read: ReadIcon,
  write: WriteIcon,
  power: PowerIcon,
};

export function StatisticIcon({
  id,
  className,
}: {
  id: StatCardId;
  className?: string | undefined;
}) {
  const Icon = ICONS[id];
  return <Icon {...(className ? { className } : {})} />;
}
