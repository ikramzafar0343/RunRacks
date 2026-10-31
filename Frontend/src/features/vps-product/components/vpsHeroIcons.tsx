/**
 * Lucide map for VPS product feature cards.
 */
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Focus,
  Gauge,
  Settings2,
  Star,
  Wallet,
} from "lucide-react";
import type { VpsHeroIconId } from "@/features/vps-product/model/vpsProductContent";

export const VPS_HERO_ICONS: Record<VpsHeroIconId, LucideIcon> = {
  gauge: Gauge,
  activity: Activity,
  star: Star,
  focus: Focus,
  settings: Settings2,
  wallet: Wallet,
};
