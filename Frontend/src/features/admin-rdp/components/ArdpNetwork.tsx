"use client";

/**
 * Catalog regions + SVG Globe — Admin RDP locations.
 */
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { HiArrowRight, HiMapPin } from "react-icons/hi2";
import { Globe, GlobeSvg } from "@/components/ui/globe";
import { Pulse } from "@/components/ui/globe-utils/pulse";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/globe-utils/tooltip";
import { ADMIN_RDP } from "@/features/admin-rdp/model/adminRdpContent";
import {
  NETWORK_GROUP_LABELS,
  NETWORK_GROUP_ORDER,
  groupForCountryCode,
  pinMetaFor,
  type NetworkGroupId,
} from "@/features/product-hosting/model/networkLocations";
import type { VpsRegion } from "@/features/vps-pricing/model/types";
import "@/features/admin-rdp/components/admin-rdp-network.css";
import "@/features/admin-rdp/components/admin-rdp-network-metrics.css";

type ArdpNetworkProps = {
  regions: readonly VpsRegion[];
};

/** NETWORK_PIN_META x,y designed for 1000×500 → SVG viewBox 1259×477 */
const PIN_SCALE_X = 1259 / 1000;
const PIN_SCALE_Y = 477 / 500;
const PIN_FO_SIZE = 24;

/** Jump to Admin RDP pricing with location query. */
function plansHref(locationId: string) {
  const params = new URLSearchParams();
  if (locationId !== "us") params.set("location", locationId);
  const q = params.toString();
  return q ? `?${q}#vps-plans` : "#vps-plans";
}

export function ArdpNetwork({ regions }: ArdpNetworkProps) {
  const baseId = useId();
  const { network } = ADMIN_RDP;
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

  const pins = useMemo(() => {
    const out: {
      id: string;
      name: string;
      x: number;
      y: number;
    }[] = [];
    for (const r of regions) {
      const meta = pinMetaFor(r.id);
      if (!meta) continue;
      out.push({
        id: r.id,
        name: r.name,
        x: meta.x * PIN_SCALE_X,
        y: meta.y * PIN_SCALE_Y,
      });
    }
    return out;
  }, [regions]);

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
    { value: "Admin", caption: "Full RDP access" },
  ] as const;

  return (
    <section
      id="locations"
      className="ardpNetwork"
      aria-labelledby={`${baseId}-heading`}
    >
      <div className="ardpNetworkGlow" aria-hidden />
      <div className="ardpNetworkInner">
        <header className="ardpNetworkHeader">
          <p className="ardpNetworkEyebrow">{network.eyebrow}</p>
          <h2 id={`${baseId}-heading`} className="ardpNetworkHeading">
            <span className="ardpNetworkHeadingAccent">{regions.length}</span>{" "}
            {network.headingAfter}
          </h2>
          <p className="ardpNetworkIntro">{network.intro}</p>
        </header>

        <div
          className="ardpNetworkGlobeWrap"
          aria-label="Interactive map of catalog regions"
        >
          <TooltipProvider delayDuration={0}>
            <Globe>
              <GlobeSvg>
                {pins.map((pin) => {
                  const active = pin.id === activeId;
                  const half = PIN_FO_SIZE / 2;
                  return (
                    <foreignObject
                      key={pin.id}
                      x={pin.x - half}
                      y={pin.y - half}
                      width={PIN_FO_SIZE}
                      height={PIN_FO_SIZE}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={plansHref(pin.id)}
                            className="ardpNetworkPinHit"
                            aria-label={`${pin.name}, in catalog`}
                            data-active={active ? "true" : "false"}
                            onMouseEnter={() => activate(pin.id)}
                            onFocus={() => activate(pin.id)}
                          >
                            <Pulse
                              className={
                                active ? "ardpNetworkPinPulseActive" : undefined
                              }
                            />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent className="ardpNetworkPinTip">
                          <p className="ardpNetworkPinTipName">{pin.name}</p>
                          <p className="ardpNetworkPinTipStatus">In catalog</p>
                        </TooltipContent>
                      </Tooltip>
                    </foreignObject>
                  );
                })}
              </GlobeSvg>
            </Globe>
          </TooltipProvider>
        </div>

        <div
          className="ardpNetworkLists"
          role="tablist"
          aria-label="Catalog regions by area"
          onKeyDown={onListKeyDown}
        >
          {groups.map((g) => (
            <div key={g.id} className="ardpNetworkGroup">
              <h3 className="ardpNetworkGroupTitle">
                <span className="ardpNetworkGroupDot" aria-hidden />
                {g.label}
              </h3>
              <ul className="ardpNetworkGroupList">
                {g.items.map((r) => {
                  const active = r.id === activeId;
                  return (
                    <li key={r.id}>
                      <a
                        id={`${baseId}-row-${r.id}`}
                        href={plansHref(r.id)}
                        role="tab"
                        aria-selected={active}
                        tabIndex={active ? 0 : -1}
                        className="ardpNetworkRow"
                        data-active={active ? "true" : "false"}
                        onMouseEnter={() => activate(r.id)}
                        onFocus={() => activate(r.id)}
                        onClick={() => activate(r.id)}
                      >
                        <HiMapPin className="ardpNetworkRowPin" aria-hidden />
                        <span className="ardpNetworkRowName">{r.name}</span>
                        <span className="ardpNetworkRowStatus" aria-hidden />
                        <span className="ardpNetworkRowChip">In catalog</span>
                        <HiArrowRight
                          className="ardpNetworkRowArrow"
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

        <div className="ardpNetworkMetrics" aria-label="Section facts">
          {metrics.map((m) => (
            <div key={m.caption} className="ardpNetworkMetric">
              <div className="ardpNetworkMetricIcon" aria-hidden>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    d="M13 2 4 14h7l-1 8 10-14h-7l0-6z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div>
                <p className="ardpNetworkMetricValue">{m.value}</p>
                <p className="ardpNetworkMetricCaption">{m.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
