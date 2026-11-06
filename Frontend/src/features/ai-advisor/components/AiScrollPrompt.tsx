"use client";

/**
 * Bottom prompt that appears after scroll and opens RunRacks AI with the question.
 */
import { ArrowUp, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import type { Route } from "next";
import { AI_SCROLL_PROMPTS } from "@/features/ai-advisor/model/aiContent";
import { SiteLogo } from "@/shared/ui/SiteLogo";
import { subscribeScrollFrame } from "@/shared/lib/scrollFrame";
import "@/features/ai-advisor/components/ai-scroll-prompt.css";

const SCROLL_ENTER = 520;
const SCROLL_EXIT = 160;
const ASK_MAX = 280;

function hiddenRoute(pathname: string) {
  return (
    pathname === "/ai" ||
    pathname.startsWith("/ai/") ||
    pathname === "/checkout"
  );
}

export function AiScrollPrompt() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const fieldId = useId();
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setDismissed(false);
  }

  useEffect(() => {
    sessionStorage.removeItem("rr-ai-scroll-dismissed");
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (dismissed || hiddenRoute(pathname)) return;
    let active = false;
    return subscribeScrollFrame(() => {
      const y = window.scrollY;
      const next = active ? y > SCROLL_EXIT : y > SCROLL_ENTER;
      if (next !== active) {
        active = next;
        setOpen(next);
      }
    });
  }, [dismissed, pathname]);

  useEffect(() => {
    if (!open || value || focused || reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % AI_SCROLL_PROMPTS.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [open, value, focused, reduceMotion]);

  if (dismissed || hiddenRoute(pathname)) return null;

  const suggestion = AI_SCROLL_PROMPTS[index] ?? AI_SCROLL_PROMPTS[0];

  function dismiss() {
    setDismissed(true);
  }

  function submit() {
    const text = (value.trim() || suggestion).slice(0, ASK_MAX);
    router.push(`/ai?ask=${encodeURIComponent(text)}` as Route);
  }

  return (
    <div
      className="aiScrollPrompt"
      data-open={open ? "true" : "false"}
      inert={!open}
    >
      <form
        className="aiScrollPromptForm"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="aiScrollPromptInner">
          <span className="aiScrollPromptMark" aria-hidden>
            <SiteLogo size="compareSm" wordmark={false} />
          </span>
          <div className="aiScrollPromptField">
            <label className="aiScrollPromptSr" htmlFor={fieldId}>
              Ask RunRacks AI
            </label>
            <input
              id={fieldId}
              className="aiScrollPromptInput"
              value={value}
              maxLength={ASK_MAX}
              autoComplete="off"
              onChange={(event) => setValue(event.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />
            {value ? null : (
              <span key={suggestion} className="aiScrollPromptHint" aria-hidden>
                {suggestion}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="aiScrollPromptSend"
            aria-label="Send"
          >
            <ArrowUp size={18} aria-hidden />
          </button>
        </div>
      </form>
      <button
        type="button"
        className="aiScrollPromptClose"
        aria-label="Dismiss Ask RunRacks AI"
        onClick={dismiss}
      >
        <X size={16} aria-hidden />
      </button>
    </div>
  );
}
