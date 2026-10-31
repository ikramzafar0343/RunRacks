/**
 * Why RunRacks Windows VPS in the USA — static feature grid copy.
 */
import type { Route } from "next";

export type WindowsUsaWhyIconId =
  "plans" | "access" | "region" | "guest" | "filters" | "support";

export type WindowsUsaWhyItem = {
  id: WindowsUsaWhyIconId;
  title: string;
  body: string;
};

export const WINDOWS_USA_WHY = {
  heading: "Why Windows VPS in the United States",
  lead: "US-filtered Windows plans with administrator access and documented NVMe specs—demo prices labeled until checkout is live.",
  ctaLabel: "View plans",
  ctaHref: "/pricing" as Route,
  items: [
    {
      id: "plans",
      title: "Clear Windows plans",
      body: "vCPU, RAM, and local NVMe are listed on every tier. Demo prices stay labeled so you can compare without guesswork.",
    },
    {
      id: "access",
      title: "Administrator access",
      body: "Full admin where the Windows family allows—install tools, manage services, and keep credentials under your control.",
    },
    {
      id: "region",
      title: "United States region",
      body: "This page defaults to the catalog location United States with the same plan language used across every region.",
    },
    {
      id: "guest",
      title: "Root of the guest",
      body: "Install your stack on the guest OS you manage. You stay responsible for apps, updates, and access keys.",
    },
    {
      id: "filters",
      title: "Predictable plan filters",
      body: "Family stays locked to Windows here. Adjust billing term or switch regions in the plan filters when you need to.",
    },
    {
      id: "support",
      title: "Engineer help",
      body: "Talk to humans who run the fleet for migration guidance and technical help—not a maze of chatbots.",
    },
  ] satisfies readonly WindowsUsaWhyItem[],
} as const;
