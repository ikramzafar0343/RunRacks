"use client";

/**
 * Hides the site footer on the AI advisor, which is a full-height chat.
 */
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

type SiteFooterGateProps = {
  children: ReactNode;
};

export function SiteFooterGate({ children }: SiteFooterGateProps) {
  const pathname = usePathname() ?? "";
  if (pathname === "/ai" || pathname.startsWith("/ai/")) return null;
  return children;
}
