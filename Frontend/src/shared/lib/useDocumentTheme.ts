"use client";

/**
 * Reads light/dark from documentElement.classList (SiteHeader theme toggle).
 */
import { useSyncExternalStore } from "react";

export type DocumentTheme = "light" | "dark";

function getSnapshot(): DocumentTheme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): DocumentTheme {
  return "light";
}

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  window.addEventListener("storage", onStoreChange);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useDocumentTheme(): DocumentTheme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function applyTheme(mode: DocumentTheme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  root.classList.toggle("light", mode === "light");
}
