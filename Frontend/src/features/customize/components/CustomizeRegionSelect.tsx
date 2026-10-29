/**
 * Region chips with catalog country flags.
 */
"use client";

import Image from "next/image";
import { flagSrc } from "@/features/customize/components/customizeIcons";
import type { VpsRegion } from "@/features/vps-pricing/model/types";

type CustomizeRegionSelectProps = {
  regions: readonly VpsRegion[];
  regionId: string;
  labelledBy: string;
  onChange: (id: string) => void;
};

export function CustomizeRegionSelect({
  regions,
  regionId,
  labelledBy,
  onChange,
}: CustomizeRegionSelectProps) {
  return (
    <div className="czRegionScroll">
      <div
        className="czRegionSeg"
        role="radiogroup"
        aria-labelledby={labelledBy}
      >
        {regions.map((r) => (
          <button
            key={r.id}
            type="button"
            role="radio"
            className="czRegionBtn"
            aria-checked={regionId === r.id}
            onClick={() => onChange(r.id)}
          >
            <Image
              src={flagSrc(r.countryCode)}
              alt=""
              width={18}
              height={12}
              className="czRegionFlag"
              unoptimized
            />
            {r.name}
          </button>
        ))}
      </div>
    </div>
  );
}
