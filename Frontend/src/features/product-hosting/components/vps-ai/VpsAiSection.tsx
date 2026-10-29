"use client";

/**
 * Sage & Ink VPS AI assistance card — tabs sync copy + auto DOM demo.
 */
import { useEffect, useId, useRef, useState } from "react";
import { VpsAiDemo, usePrefersReducedMotion } from "./VpsAiDemo";
import { VpsAiTabs } from "./VpsAiTabs";
import { DEFAULT_DEMO_ID, demoById, type DemoId } from "./vpsAiData";
import "./vps-ai-section.css";

export function VpsAiSection() {
  const baseId = useId();
  const [activeId, setActiveId] = useState<DemoId>(DEFAULT_DEMO_ID);
  const [offscreenPaused, setOffscreenPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement | null>(null);
  const demo = demoById(activeId);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = (entry?.intersectionRatio ?? 0) > 0.35;
        setOffscreenPaused(!visible);
      },
      { threshold: [0, 0.35, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="vpsAiSection" aria-label="VPS AI assistance">
      <div className="vpsAiCard">
        <div className="vpsAiCopyColumn">
          <VpsAiTabs
            activeId={activeId}
            baseId={baseId}
            onSelect={setActiveId}
          />
          <div
            className="vpsAiCopy"
            role="tabpanel"
            id={`${baseId}-panel`}
            aria-labelledby={`${baseId}-tab-${activeId}`}
          >
            <h2>{demo.heading}</h2>
            <p>{demo.description}</p>
          </div>
        </div>

        <VpsAiDemo
          demo={demo}
          sceneKey={`${baseId}-${activeId}`}
          reducedMotion={reducedMotion}
          offscreenPaused={offscreenPaused}
          stageRef={stageRef}
        />
      </div>
    </section>
  );
}
