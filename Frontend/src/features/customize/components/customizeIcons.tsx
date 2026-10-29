/**
 * Shared icons / flag path for the customize configurator.
 */
import { FaWindows } from "react-icons/fa";
import { HiOutlineServerStack } from "react-icons/hi2";
import { SiLinux } from "react-icons/si";
import type { VpsFamily } from "@/features/vps-pricing/model/types";

export function flagSrc(countryCode: string) {
  return `/flags/${countryCode.toLowerCase()}.svg`;
}

export function familyIcon(family: VpsFamily) {
  if (family === "linux") return <SiLinux size={15} aria-hidden />;
  if (family === "windows") return <FaWindows size={14} aria-hidden />;
  return <HiOutlineServerStack size={15} aria-hidden />;
}
