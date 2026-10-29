"use client";

/**
 * Professional terminal — typewriter reveal with blinking cursor.
 */
import { useEffect, useMemo, useState } from "react";

type VpsAiTerminalProps = {
  lines: readonly string[];
  instant?: boolean;
  sceneKey: string;
};

function lineClass(line: string): string {
  if (/^root@|^\$ /.test(line) || line.includes("@vps:")) {
    return "vpsAiTerminalLine vpsAiTerminalLine--prompt";
  }
  if (
    /Active: active|enabled$|HTTP\/1\.1 200|Security checks complete|healthy again/i.test(
      line,
    )
  ) {
    return "vpsAiTerminalLine vpsAiTerminalLine--ok";
  }
  return "vpsAiTerminalLine";
}

export function VpsAiTerminal({
  lines,
  instant = false,
  sceneKey,
}: VpsAiTerminalProps) {
  const target = useMemo(() => lines.join("\n"), [lines]);
  const [shown, setShown] = useState(instant ? target : "");
  const [boundScene, setBoundScene] = useState(sceneKey);

  if (sceneKey !== boundScene) {
    setBoundScene(sceneKey);
    setShown(instant ? target : "");
  }

  if (instant && shown !== target) {
    setShown(target);
  }

  useEffect(() => {
    if (instant) return;

    if (!target.startsWith(shown) && shown.length > 0) {
      let i = 0;
      while (i < shown.length && i < target.length && shown[i] === target[i]) {
        i += 1;
      }
      if (i < shown.length) {
        const id = window.setTimeout(() => {
          setShown(target.slice(0, i));
        }, 0);
        return () => window.clearTimeout(id);
      }
    }

    if (shown.length >= target.length) {
      if (shown !== target) {
        const id = window.setTimeout(() => setShown(target), 0);
        return () => window.clearTimeout(id);
      }
      return;
    }

    const nextChar = target[shown.length] ?? "";
    const delay = nextChar === "\n" ? 90 : nextChar === " " ? 16 : 14;
    const id = window.setTimeout(() => {
      setShown(target.slice(0, shown.length + 1));
    }, delay);
    return () => window.clearTimeout(id);
  }, [target, shown, instant]);

  const displayLines = shown.split("\n");
  const rows =
    shown.endsWith("\n") && shown.length < target.length
      ? displayLines
      : displayLines;

  const typing = !instant && shown.length < target.length;

  return (
    <div className="vpsAiTerminal">
      <div className="vpsAiTerminalChrome" aria-hidden>
        <span className="vpsAiTerminalDot" />
        <span className="vpsAiTerminalDot" />
        <span className="vpsAiTerminalDot" />
        <span className="vpsAiTerminalTitle">root@vps</span>
      </div>
      <pre className="vpsAiTerminalBody">
        {rows.map((line, i) => (
          <div key={`${i}-${line.slice(0, 12)}`} className={lineClass(line)}>
            {line}
            {typing && i === rows.length - 1 ? (
              <span className="vpsAiTerminalCursor" />
            ) : null}
          </div>
        ))}
      </pre>
    </div>
  );
}
