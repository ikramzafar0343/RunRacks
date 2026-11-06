/**
 * Assistant text with catalog flags and family icons beside known names.
 */
"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { Cpu, Gauge, HardDrive, MemoryStick } from "lucide-react";
import { familyIcon, flagSrc } from "@/features/customize";
import type { VpsFamily } from "@/features/vps-pricing";
import "@/features/ai-advisor/components/advisor-reply.css";

type SpecKind = "vcpu" | "ram" | "nvme" | "bandwidth";

type Mark =
  | { label: string; kind: "flag"; code: string }
  | { label: string; kind: "family"; family: VpsFamily }
  | { label: string; kind: "spec"; spec: SpecKind };

const MARKS: readonly Mark[] = [
  { label: "Admin RDP", kind: "family", family: "windows-admin-rdp" },
  { label: "Windows VPS", kind: "family", family: "windows" },
  { label: "Linux VPS", kind: "family", family: "linux" },
  { label: "United Arab Emirates", kind: "flag", code: "ae" },
  { label: "United Kingdom", kind: "flag", code: "gb" },
  { label: "United States", kind: "flag", code: "us" },
  { label: "Netherlands", kind: "flag", code: "nl" },
  { label: "Bangladesh", kind: "flag", code: "bd" },
  { label: "Australia", kind: "flag", code: "au" },
  { label: "Singapore", kind: "flag", code: "sg" },
  { label: "Pakistan", kind: "flag", code: "pk" },
  { label: "Germany", kind: "flag", code: "de" },
  { label: "Canada", kind: "flag", code: "ca" },
  { label: "India", kind: "flag", code: "in" },
  { label: "Japan", kind: "flag", code: "jp" },
];

const MARK_BY_LABEL = new Map(MARKS.map((mark) => [mark.label, mark]));
const SPEC_SRC = String.raw`\d+(?:\.\d+)?\s*(?:vCPU|GB\s*RAM|GB\s*NVMe|TB(?:\s*bandwidth)?)`;
const PATTERN = new RegExp(
  `\\b(?:${MARKS.map((mark) => mark.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")}|${SPEC_SRC})\\b`,
  "g",
);

function markFor(label: string): Mark | null {
  const named = MARK_BY_LABEL.get(label);
  if (named) return named;
  if (/vCPU/i.test(label)) return { label, kind: "spec", spec: "vcpu" };
  if (/RAM/i.test(label)) return { label, kind: "spec", spec: "ram" };
  if (/NVMe/i.test(label)) return { label, kind: "spec", spec: "nvme" };
  if (/\bTB\b/i.test(label)) return { label, kind: "spec", spec: "bandwidth" };
  return null;
}

const CHIP_FAMILY: Record<string, VpsFamily> = {
  linux: "linux",
  windows: "windows",
  "admin-rdp": "windows-admin-rdp",
};

const CHIP_FLAG: Record<string, string> = {
  us: "us",
  gb: "gb",
  ca: "ca",
  nl: "nl",
  de: "de",
  sg: "sg",
  au: "au",
  jp: "jp",
};

export function AdvisorReplyText({ text }: { text: string }) {
  const pattern = new RegExp(PATTERN.source, "g");
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    const label = match[0];
    const mark = markFor(label);
    if (index > last) nodes.push(text.slice(last, index));
    nodes.push(
      mark ? (
        <ReplyMark key={`${index}-${label}`} mark={mark} />
      ) : (
        label
      ),
    );
    last = index + label.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

function ReplyMark({ mark }: { mark: Mark }) {
  return (
    <span className="aiReplyToken">
      {mark.kind === "flag" ? <Flag code={mark.code} /> : null}
      {mark.kind === "family" ? (
        <span className="aiReplyIcon">{familyIcon(mark.family)}</span>
      ) : null}
      {mark.kind === "spec" ? <SpecGlyph spec={mark.spec} /> : null}
      {mark.label}
    </span>
  );
}

export function AdvisorChipMark({ id, label }: { id: string; label: string }) {
  const code = CHIP_FLAG[id];
  if (code) return <Flag code={code} />;
  const family =
    CHIP_FAMILY[id] ??
    (label === "Admin RDP"
      ? "windows-admin-rdp"
      : label === "Windows VPS"
        ? "windows"
        : label === "Linux VPS"
          ? "linux"
          : null);
  if (!family) return null;
  return <span className="aiReplyIcon">{familyIcon(family)}</span>;
}

function SpecGlyph({ spec }: { spec: SpecKind }) {
  const Icon =
    spec === "vcpu"
      ? Cpu
      : spec === "ram"
        ? MemoryStick
        : spec === "nvme"
          ? HardDrive
          : Gauge;
  return (
    <span className="aiReplyIcon">
      <Icon size={16} strokeWidth={2.25} aria-hidden />
    </span>
  );
}

function Flag({ code }: { code: string }) {
  return (
    <Image
      src={flagSrc(code)}
      alt=""
      width={18}
      height={12}
      className="aiReplyFlag"
      unoptimized
    />
  );
}
