/**
 * VPS hero deploy terminal — fixed-height typewriter that loops after completion.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { VPS_PRODUCT } from "@/features/vps-product/model/vpsProductContent";
import "@/features/vps-product/components/vps-product-hero-terminal.css";

const HOLD_MS = 2400;
const RESTART_GAP_MS = 450;

function buildScript(): string[] {
  const t = VPS_PRODUCT.hero.terminal;
  return [
    `${t.prompt} ${t.command}`,
    ...t.steps.map((step) => `→ ${step}`),
    `✓ ${t.success}`,
    ...t.details.map((row) => `${row.label}\t${row.value}`),
    `${t.prompt} `,
  ];
}

function lineKind(line: string): "cmd" | "step" | "ok" | "detail" | "idle" {
  if (line.startsWith("✓")) return "ok";
  if (line.startsWith("→")) return "step";
  if (line.includes("\t")) return "detail";
  if (/^\$\s*$/.test(line) || line === "$ ") return "idle";
  if (line.startsWith("$")) return "cmd";
  return "step";
}

export function VpsHeroTerminal() {
  const lines = useMemo(() => buildScript(), []);
  const target = useMemo(() => lines.join("\n"), [lines]);
  const [instant, setInstant] = useState(false);
  const [shown, setShown] = useState("");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (reduce.matches) {
        setInstant(true);
        setShown(target);
      } else {
        setInstant(false);
      }
    };
    apply();
    reduce.addEventListener("change", apply);
    return () => reduce.removeEventListener("change", apply);
  }, [target]);

  useEffect(() => {
    if (instant) {
      setShown(target);
      return;
    }

    if (shown.length >= target.length) {
      const hold = window.setTimeout(() => {
        setShown("");
        setCycle((n) => n + 1);
      }, HOLD_MS);
      return () => window.clearTimeout(hold);
    }

    if (shown.length === 0 && cycle > 0) {
      const gap = window.setTimeout(() => {
        setShown(target.slice(0, 1));
      }, RESTART_GAP_MS);
      return () => window.clearTimeout(gap);
    }

    const nextChar = target[shown.length] ?? "";
    const delay = nextChar === "\n" ? 95 : nextChar === " " ? 14 : 12;
    const id = window.setTimeout(() => {
      setShown(target.slice(0, shown.length + 1));
    }, delay);
    return () => window.clearTimeout(id);
  }, [target, shown, instant, cycle]);

  const rows = shown.length > 0 ? shown.split("\n") : [""];
  const typing = !instant && shown.length < target.length;
  const done = !instant && shown.length >= target.length;
  const title = VPS_PRODUCT.hero.terminal.title;

  return (
    <div
      className="vpsHeroTerm"
      role="img"
      aria-label="Illustrated RunRacks deploy terminal session"
    >
      <div className="vpsHeroTermChrome" aria-hidden>
        <span className="vpsHeroTermDot vpsHeroTermDot--red" />
        <span className="vpsHeroTermDot vpsHeroTermDot--amber" />
        <span className="vpsHeroTermDot vpsHeroTermDot--green" />
        <span className="vpsHeroTermTitle">{title}</span>
      </div>
      <pre className="vpsHeroTermBody">
        {rows.map((line, i) => {
          const kind = lineKind(line);
          const isLast = i === rows.length - 1;
          const showCursor = isLast && (typing || done || shown.length === 0);
          if (kind === "detail") {
            const [label = "", value = ""] = line.split("\t");
            return (
              <div
                key={`${cycle}-${i}-${label}`}
                className="vpsHeroTermLine vpsHeroTermLine--detail"
              >
                <span className="vpsHeroTermDetailLabel">{label}</span>
                <span className="vpsHeroTermDetailValue">{value}</span>
                {showCursor ? <span className="vpsHeroTermCursor" /> : null}
              </div>
            );
          }
          return (
            <div
              key={`${cycle}-${i}-${line.slice(0, 16)}`}
              className={`vpsHeroTermLine vpsHeroTermLine--${kind}`}
            >
              {line}
              {showCursor ? <span className="vpsHeroTermCursor" /> : null}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
