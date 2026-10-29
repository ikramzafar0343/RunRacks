/**
 * Plan Finder — the three RunRacks products. No invented prices.
 */
import type { VpsFamily } from "@/features/vps-pricing/model/types";

export const PLAN_CHOICES = [
  { family: "linux", title: "Linux VPS" },
  { family: "windows", title: "Windows VPS" },
  { family: "windows-admin-rdp", title: "Admin RDP" },
] as const satisfies readonly { family: VpsFamily; title: string }[];
