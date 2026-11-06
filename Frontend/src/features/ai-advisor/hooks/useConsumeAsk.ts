"use client";

import { useEffect, useRef } from "react";

/** Sends a `?ask=` question once, then drops it from the address bar. */
export function useConsumeAsk(
  ask: string | null,
  onAsk: (text: string) => void,
) {
  const onAskRef = useRef(onAsk);
  const started = useRef(false);

  useEffect(() => {
    onAskRef.current = onAsk;
  }, [onAsk]);

  useEffect(() => {
    const text = ask?.trim();
    if (!text || started.current) return;
    const id = window.setTimeout(() => {
      if (started.current) return;
      started.current = true;
      onAskRef.current(text);
      const url = new URL(window.location.href);
      if (!url.searchParams.has("ask")) return;
      url.searchParams.delete("ask");
      const next = `${url.pathname}${url.search}${url.hash}`;
      window.history.replaceState(window.history.state, "", next);
    }, 0);
    return () => window.clearTimeout(id);
  }, [ask]);
}
