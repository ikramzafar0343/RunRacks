/**
 * Why Choose Us — resolve per-page content (no shared feature bodies).
 */
import { WHY_CHOOSE_ADMIN_RDP } from "@/features/why-choose/model/whyChooseAdminRdp";
import { WHY_CHOOSE_LINUX } from "@/features/why-choose/model/whyChooseLinux";
import {
  WHY_CHOOSE_ADMIN_RDP_USA,
  WHY_CHOOSE_LINUX_USA,
  WHY_CHOOSE_WINDOWS_USA,
} from "@/features/why-choose/model/whyChooseUsa";
import { WHY_CHOOSE_WINDOWS } from "@/features/why-choose/model/whyChooseWindows";
import type { WhyChooseContent } from "@/features/why-choose/model/whyChooseTypes";

export type WhyChooseVariant =
  | "linux"
  | "windows"
  | "admin-rdp"
  | "linux-usa"
  | "windows-usa"
  | "admin-rdp-usa";

const BY_VARIANT: Record<WhyChooseVariant, WhyChooseContent> = {
  linux: WHY_CHOOSE_LINUX,
  windows: WHY_CHOOSE_WINDOWS,
  "admin-rdp": WHY_CHOOSE_ADMIN_RDP,
  "linux-usa": WHY_CHOOSE_LINUX_USA,
  "windows-usa": WHY_CHOOSE_WINDOWS_USA,
  "admin-rdp-usa": WHY_CHOOSE_ADMIN_RDP_USA,
};

export function getWhyChooseContent(
  variant: WhyChooseVariant,
): WhyChooseContent {
  return BY_VARIANT[variant];
}
