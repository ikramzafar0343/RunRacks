/**
 * Plan detail value with OS logos / region flags / section icons.
 */
import Image from "next/image";
import {
  HiClock,
  HiGlobeAlt,
  HiLockClosed,
  HiServerStack,
  HiSignal,
} from "react-icons/hi2";
import { FaWindows } from "react-icons/fa";
import { SiAlmalinux, SiDebian, SiUbuntu } from "react-icons/si";
import { getDemoVpsCatalog } from "@/features/vps-pricing/model/demoCatalog";
import type {
  VpsFamily,
  VpsPlanDetail,
} from "@/features/vps-pricing/model/types";

type VpsPlanDetailValueProps = {
  item: VpsPlanDetail;
  family: VpsFamily;
  availableRegionIds: readonly string[];
  selectedLocationId?: string | null | undefined;
};

function flagSrc(countryCode: string) {
  return `/flags/${countryCode}.svg`;
}

export function VpsPlanDetailContent({
  item,
  family,
  availableRegionIds,
  selectedLocationId,
}: VpsPlanDetailValueProps) {
  const label = item.label.toLowerCase();

  if (label === "operating systems" || label === "os") {
    const isWindowsAdminRdp =
      family === "windows-admin-rdp" || /admin\s*rdp/i.test(item.value);
    const isWindows =
      family === "windows" ||
      (/windows/i.test(item.value) && !isWindowsAdminRdp);

    if (isWindowsAdminRdp) {
      return (
        <span className="vpsPlanDetailMarks" aria-label={item.value}>
          <span className="vpsPlanDetailMark">
            <FaWindows size={16} color="#00A4EF" aria-hidden />
            <span>Windows Server (Admin RDP)</span>
          </span>
        </span>
      );
    }

    if (isWindows) {
      return (
        <span className="vpsPlanDetailMarks" aria-label={item.value}>
          <span className="vpsPlanDetailMark">
            <FaWindows size={16} color="#00A4EF" aria-hidden />
            <span>Windows Server</span>
          </span>
        </span>
      );
    }

    return (
      <span className="vpsPlanDetailMarks" aria-label={item.value}>
        <span className="vpsPlanDetailMark">
          <SiUbuntu size={16} color="#E95420" aria-hidden />
          <span>Ubuntu</span>
        </span>
        <span className="vpsPlanDetailMark">
          <SiDebian size={16} color="#A80030" aria-hidden />
          <span>Debian</span>
        </span>
        <span className="vpsPlanDetailMark">
          <SiAlmalinux size={16} color="#1E4F8A" aria-hidden />
          <span>AlmaLinux</span>
        </span>
      </span>
    );
  }

  if (label === "regions" || label === "locations" || label === "region") {
    const allRegions = getDemoVpsCatalog().regions;
    const target =
      (selectedLocationId
        ? allRegions.find((r) => r.id === selectedLocationId)
        : null) ??
      allRegions.find((r) => availableRegionIds.includes(r.id)) ??
      allRegions[0];

    if (!target) return null;

    return (
      <span className="vpsPlanDetailFlags" aria-label={target.name}>
        <span className="vpsPlanDetailFlag" title={target.name}>
          <Image
            src={flagSrc(target.countryCode)}
            alt=""
            width={20}
            height={14}
            className="vpsPlanDetailFlagImg"
            unoptimized
          />
          <span className="vpsPlanDetailFlagName">{target.name}</span>
        </span>
      </span>
    );
  }

  const Icon =
    label === "access"
      ? HiLockClosed
      : label === "storage"
        ? HiServerStack
        : label === "network"
          ? HiSignal
          : label === "delivery"
            ? HiClock
            : HiGlobeAlt;

  return (
    <span className="vpsPlanDetailText">
      <Icon className="vpsPlanDetailIcon" size={16} aria-hidden />
      <span>{item.value}</span>
    </span>
  );
}

export function VpsPlanDetailValue(props: VpsPlanDetailValueProps) {
  return (
    <dd className="vpsPlanDetailValue">
      <VpsPlanDetailContent {...props} />
    </dd>
  );
}
