/**
 * Home AI CTA copy — real routes only, no simulated product claims.
 */
import type { Route } from "next";
import { TRY_AI_CTA } from "@/shared/config/navConfig";

export const AI_CTA = {
  heading: "Plan your stack with RunRacks AI",
  supporting:
    "Ask for plan fit, OS choices, and routine server tasks in plain language—then open Pricing when you are ready to compare NVMe tiers.",
  primary: {
    label: "View plans",
    href: "/pricing" as Route,
  },
  secondary: {
    label: TRY_AI_CTA.label,
    href: TRY_AI_CTA.href,
  },
} as const;
