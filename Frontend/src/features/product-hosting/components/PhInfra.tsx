"use client";

/**
 * Catalog regions map — Sage & Ink section chrome + dotted WorldMap.
 */
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi2";
import { WorldMap } from "@/components/ui/map";
import { flagSrc } from "@/features/customize/components/customizeIcons";
import {
  NETWORK_GROUP_LABELS,
  NETWORK_GROUP_ORDER,
  buildNetworkDots,
  groupForCountryCode,
  pinMetaFor,
  type NetworkGroupId,
} from "@/features/product-hosting/model/networkLocations";
import type { VpsRegion } from "@/features/vps-pricing/model/types";
import "@/features/product-hosting/components/product-hosting-network.css";

type PhInfraProps = {
  heading: string;
  regions: readonly VpsRegion[];
  /** Supporting line under the heading. */
  intro?: string;
  /** In-page pricing anchor (hash). Defaults to `#vps-pricing`. */
  pricingAnchor?: string;
};

/** Same-tab jump to pricing with location query (hash after search). */
function pricingHref(locationId: string, pricingAnchor: string) {
  const params = new URLSearchParams();
  if (locationId !== "us") params.set("location", locationId);
  const q = params.toString();
  const hash = pricingAnchor.startsWith("#")
    ? pricingAnchor
    : `#${pricingAnchor}`;
  return q ? `?${q}${hash}` : hash;
}

export function PhInfra({
  heading,
  regions,
  intro = "Same catalog regions as pricing filters—select a row, then open plans for that location.",
  pricingAnchor = "#vps-pricing",
}: PhInfraProps) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(regions[0]?.id ?? "");

  const groups = useMemo(() => {
    const map = new Map<NetworkGroupId, VpsRegion[]>();
    for (const g of NETWORK_GROUP_ORDER) map.set(g, []);
    for (const r of regions) {
      const meta = pinMetaFor(r.id);
      const group = meta?.group ?? groupForCountryCode(r.countryCode);
      map.get(group)?.push(r);
    }
    return NETWORK_GROUP_ORDER.map((id) => ({
      id,
      label: NETWORK_GROUP_LABELS[id],
      items: map.get(id) ?? [],
    })).filter((g) => g.items.length > 0);
  }, [regions]);

  const flatIds = useMemo(() => regions.map((r) => r.id), [regions]);
  const dots = useMemo(() => buildNetworkDots(regions), [regions]);

  function activate(id: string) {
    setActiveId(id);
  }

  function onListKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const index = flatIds.indexOf(activeId);
    if (index < 0) return;
    let next = index;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      next = (index + 1) % flatIds.length;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      next = (index - 1 + flatIds.length) % flatIds.length;
    } else {
      return;
    }
    const id = flatIds[next];
    if (!id) return;
    activate(id);
    document.getElementById(`${baseId}-row-${id}`)?.focus();
  }

  const metrics = [
    { value: String(regions.length), caption: "Catalog regions" },
    { value: "NVMe", caption: "Local disk plans" },
    { value: "Demo", caption: "Labeled pricing" },
    { value: "3", caption: "Hosting families" },
  ] as const;

  return (
    <section
      id="locations"
      className="phNetwork"
      aria-labelledby={`${baseId}-heading`}
    >
      <div className="phNetworkGlow" aria-hidden />
      <div className="phNetworkInner">
        <header className="phNetworkHeader">
          <p className="phNetworkEyebrow">Global network</p>
          <h2 id={`${baseId}-heading`} className="phNetworkHeading">
            <span className="phNetworkHeadingAccent">{regions.length}</span>{" "}
            locations. Pick a region, open plans.
          </h2>
          <p className="phNetworkIntro">{intro}</p>
        </header>

        <div
          className="phNetworkMapWrap"
          aria-label={`${heading}: dotted world map of catalog regions`}
        >
          <WorldMap
            dots={dots}
            showLabels
            labelClassName="text-xs"
            className="phNetworkWorldMap"
          />
        </div>

        <div
          className="phNetworkLists"
          role="tablist"
          aria-label="Catalog regions by area"
          onKeyDown={onListKeyDown}
        >
          {groups.map((g) => (
            <div key={g.id} className="phNetworkGroup">
              <h3 className="phNetworkGroupTitle">
                <span className="phNetworkGroupDot" aria-hidden />
                {g.label}
              </h3>
              <ul className="phNetworkGroupList">
                {g.items.map((r) => {
                  const active = r.id === activeId;
                  return (
                    <li key={r.id}>
                      <a
                        id={`${baseId}-row-${r.id}`}
                        href={pricingHref(r.id, pricingAnchor)}
                        role="tab"
                        aria-selected={active}
                        tabIndex={active ? 0 : -1}
                        className="phNetworkRow"
                        data-active={active ? "true" : "false"}
                        onMouseEnter={() => activate(r.id)}
                        onFocus={() => activate(r.id)}
                        onClick={() => activate(r.id)}
                      >
                        <Image
                          src={flagSrc(r.countryCode)}
                          alt=""
                          width={18}
                          height={14}
                          className="phNetworkRowFlag"
                          aria-hidden
                        />
                        <span className="phNetworkRowName">{r.name}</span>
                        <span className="phNetworkRowStatus" aria-hidden />
                        <span className="phNetworkRowChip">In catalog</span>
                        <HiArrowRight
                          className="phNetworkRowArrow"
                          aria-hidden
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="phNetworkMetrics" aria-label="Section facts">
          {metrics.map((m) => (
            <div key={m.caption} className="phNetworkMetric">
              <div className="phNetworkMetricIcon" aria-hidden>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    d="M13 2 4 14h7l-1 8 10-14h-7l0-6z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <p className="phNetworkMetricValue">{m.value}</p>
                <p className="phNetworkMetricCaption">{m.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
