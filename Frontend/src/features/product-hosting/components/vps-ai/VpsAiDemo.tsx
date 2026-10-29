"use client";

/**
 * 4:3 Sage demo stage — auto-playing DOM terminal + Agent (no pause control).
 */
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from "react";
import { VpsAiAgentPanel } from "./VpsAiAgentPanel";
import { VpsAiTerminal } from "./VpsAiTerminal";
import { frameAt, posterFrame, type DemoState } from "./vpsAiData";

type VpsAiDemoProps = {
  demo: DemoState;
  sceneKey: string;
  reducedMotion: boolean;
  offscreenPaused: boolean;
  stageRef: RefObject<HTMLDivElement | null>;
};

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function VpsAiDemo({
  demo,
  sceneKey,
  reducedMotion,
  offscreenPaused,
  stageRef,
}: VpsAiDemoProps) {
  const [elapsed, setElapsed] = useState(0);
  const [clockScene, setClockScene] = useState(sceneKey);
  const playing = !reducedMotion && !offscreenPaused;
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  if (sceneKey !== clockScene) {
    setClockScene(sceneKey);
    setElapsed(0);
  }

  useEffect(() => {
    if (!playing) {
      lastTsRef.current = null;
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const delta = ts - lastTsRef.current;
      lastTsRef.current = ts;
      setElapsed((prev) => (prev + delta) % demo.durationMs);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playing, demo.durationMs, sceneKey]);

  const frame = reducedMotion ? posterFrame(demo) : frameAt(demo, elapsed);

  return (
    <div ref={stageRef} className="vpsAiDemo">
      <div className="vpsAiDemoScene" key={sceneKey} aria-hidden>
        <VpsAiTerminal
          lines={frame.terminalLines}
          instant={reducedMotion || offscreenPaused}
          sceneKey={sceneKey}
        />
        <VpsAiAgentPanel
          messages={frame.agentMessages}
          sceneKey={sceneKey}
          instant={reducedMotion || offscreenPaused}
          {...(frame.confirmPrompt
            ? { confirmPrompt: frame.confirmPrompt }
            : {})}
        />
      </div>
    </div>
  );
}
