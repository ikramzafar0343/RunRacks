/**
 * Lucide map for VPS product feature cards.
 */
import type { LucideIcon } from "lucide-react";
import {
  Cpu,
  Globe,
  HardDrive,
  Headphones,
  KeyRound,
  Shield,
} from "lucide-react";
import type { VpsHeroIconId } from "@/features/vps-product/model/vpsProductContent";

export const VPS_HERO_ICONS: Record<VpsHeroIconId, LucideIcon> = {
  cpu: Cpu,
  hardDrive: HardDrive,
  keyRound: KeyRound,
  globe: Globe,
  shield: Shield,
  headphones: Headphones,
};
