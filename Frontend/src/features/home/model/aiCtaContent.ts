/**
 * Home AI CTA copy — real routes only, no simulated product claims.
 */
import type { Route } from "next";

export const AI_CTA = {
  heading: "Let AI manage your VPS",
  supporting:
    "Use RunRacks AI to plan deploys, choose a stack, and handle routine server tasks with clear prompts — on NVMe infrastructure built for performance.",
  primary: {
    label: "View plans",
    href: "/pricing" as Route,
  },
  secondary: {
    label: "Open RunRacks AI",
    href: "/ai" as Route,
  },
} as const;
