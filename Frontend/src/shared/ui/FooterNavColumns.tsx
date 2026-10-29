/**
 * Footer link columns — grid on desktop, exclusive accordion on mobile.
 */
"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { FooterColumn } from "@/shared/config/footerConfig";

const DESKTOP_MQ = "(min-width: 640px)";

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_MQ);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_MQ).matches;
}

/** Prefer open columns for SSR/crawl; mobile remounts closed after hydrate. */
function getServerSnapshot() {
  return true;
}

function PlusIcon() {
  return (
    <svg
      className="siteFooterAccordIcon"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 4v12M4 10h12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

type FooterNavColumnsProps = {
  columns: readonly FooterColumn[];
};

export function FooterNavColumns({ columns }: FooterNavColumnsProps) {
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getServerSnapshot,
  );

  return (
    <>
      {columns.map((column) => (
        <details
          key={`${column.id}-${isDesktop ? "desk" : "mob"}`}
          className="siteFooterCol siteFooterAccord"
          suppressHydrationWarning
          {...(isDesktop
            ? { open: true as const }
            : { name: "site-footer-nav" })}
        >
          <summary className="siteFooterAccordTrigger">
            <span className="siteFooterColTitle">{column.title}</span>
            <PlusIcon />
          </summary>
          <nav aria-label={column.title}>
            <ul className="siteFooterList">
              {column.links.map((link) => (
                <li key={`${column.id}-${link.label}`}>
                  <Link href={link.href} className="siteFooterLink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      ))}
    </>
  );
}
