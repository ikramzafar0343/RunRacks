"use client";

import Image from "next/image";
import Link from "next/link";
import { UsaMapPlane } from "@/features/vps-usa/components/UsaMapPlane";
import { UsaReveal } from "@/features/vps-usa/components/UsaReveal";
import {
  VPS_USA,
  VPS_USA_MAP_DOTS,
} from "@/features/vps-usa/model/vpsUsaContent";

export function VpsUsaCoverage() {
  const { eyebrow, heading, lead, region } = VPS_USA.coverage;

  return (
    <section className="usaCoverage" aria-labelledby="usa-coverage-heading">
      <UsaReveal className="usaInner usaCoverageInner">
        <div className="usaCoverageCopy" data-usa-reveal>
          <p className="usaEyebrow">{eyebrow}</p>
          <h2 id="usa-coverage-heading" className="usaHeading">
            {heading}
          </h2>
          <p className="usaLead">{lead}</p>
          <Link
            href={region.href}
            className="usaRegionChip"
            aria-label={`${region.name} — jump to plans`}
          >
            <Image
              src={`/flags/${region.countryCode}.svg`}
              alt=""
              width={22}
              height={16}
              className="usaRegionFlag"
            />
            <span>{region.name}</span>
          </Link>
        </div>
        <div
          className="usaCoverageMap"
          data-usa-reveal
          aria-label="United States region on dotted world map"
        >
          <UsaMapPlane
            dots={VPS_USA_MAP_DOTS}
            className="usaCoverageWorldMap"
            loop={false}
          />
        </div>
      </UsaReveal>
    </section>
  );
}
