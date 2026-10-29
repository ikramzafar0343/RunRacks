/**
 * Client configurator — icons, flags, bordered controls, demo price.
 */
"use client";

import { useMemo, useState } from "react";
import {
  HiCircleStack,
  HiCloud,
  HiCpuChip,
  HiGlobeAlt,
  HiOutlineCalendarDays,
  HiServer,
  HiSignal,
} from "react-icons/hi2";
import { CustomizePriceCard } from "@/features/customize/components/CustomizePriceCard";
import { CustomizeRegionSelect } from "@/features/customize/components/CustomizeRegionSelect";
import { CustomizeSlider } from "@/features/customize/components/CustomizeSlider";
import { familyIcon } from "@/features/customize/components/customizeIcons";
import { CUSTOMIZE } from "@/features/customize/model/customizeContent";
import { calculateCustomizePrice } from "@/features/customize/model/customizePricing";
import type {
  BillingTermMonths,
  VpsFamily,
  VpsRegion,
} from "@/features/vps-pricing/model/types";
import "@/features/customize/components/customize.css";
import "@/features/customize/components/customize-summary.css";

export type CustomizeConfiguratorProps = {
  regions: readonly VpsRegion[];
  defaultRegionId: string;
  /** Override summary CTAs (e.g. `#vps-plans` when embedded on the VPS page). */
  plansHref?: string;
  /** When set, locks family and hides the Hosting type control. */
  lockedFamily?: VpsFamily;
};

export function CustomizeConfigurator({
  regions,
  defaultRegionId,
  plansHref,
  lockedFamily,
}: CustomizeConfiguratorProps) {
  const d = CUSTOMIZE.defaults;
  const [family, setFamily] = useState<VpsFamily>(lockedFamily ?? d.family);
  const [regionId, setRegionId] = useState(defaultRegionId);
  const [term, setTerm] = useState<BillingTermMonths>(d.billingTermMonths);
  const [vcpu, setVcpu] = useState<number>(d.vcpu);
  const [ramGb, setRamGb] = useState<number>(d.ramGb);
  const [nvmeGb, setNvmeGb] = useState<number>(d.nvmeGb);
  const [bandwidthTb, setBandwidthTb] = useState<number>(d.bandwidthTb);
  const [dedicatedIpv4, setDedicatedIpv4] = useState<boolean>(d.dedicatedIpv4);
  const [automatedBackups, setAutomatedBackups] = useState<boolean>(
    d.automatedBackups,
  );

  const price = useMemo(
    () =>
      calculateCustomizePrice({
        family,
        regionId,
        billingTermMonths: term,
        vcpu,
        ramGb,
        nvmeGb,
        bandwidthTb,
        dedicatedIpv4,
        automatedBackups,
      }),
    [
      family,
      regionId,
      term,
      vcpu,
      ramGb,
      nvmeGb,
      bandwidthTb,
      dedicatedIpv4,
      automatedBackups,
    ],
  );

  const selectedRegion = regions.find((r) => r.id === regionId);
  const familyLabel =
    CUSTOMIZE.families.find((f) => f.id === family)?.label ?? family;
  const s = CUSTOMIZE.sliders;

  return (
    <div className="czConfigInner">
      <div className="czPanel">
        {lockedFamily ? null : (
          <div className="czFieldBlock">
            <p className="czFieldLabel" id="cz-family-label">
              <span className="czFieldLabelIcon" aria-hidden>
                <HiServer size={14} />
              </span>
              Hosting type
            </p>
            <div
              className="czSeg"
              role="group"
              aria-labelledby="cz-family-label"
            >
              {CUSTOMIZE.families.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className="czSegBtn"
                  aria-pressed={family === f.id}
                  onClick={() => setFamily(f.id)}
                >
                  <span className="czSegBtnIcon">{familyIcon(f.id)}</span>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="czFieldBlock">
          <p className="czFieldLabel" id="cz-region-label">
            <span className="czFieldLabelIcon" aria-hidden>
              <HiGlobeAlt size={14} />
            </span>
            Country / region
          </p>
          <CustomizeRegionSelect
            regions={regions}
            regionId={regionId}
            labelledBy="cz-region-label"
            onChange={setRegionId}
          />
        </div>

        <div className="czFieldBlock">
          <p className="czFieldLabel" id="cz-term-label">
            <span className="czFieldLabelIcon" aria-hidden>
              <HiOutlineCalendarDays size={14} />
            </span>
            Billing term
          </p>
          <div className="czSeg" role="group" aria-labelledby="cz-term-label">
            {CUSTOMIZE.terms.map((t) => (
              <button
                key={t.months}
                type="button"
                className="czSegBtn"
                aria-pressed={term === t.months}
                onClick={() => setTerm(t.months)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="czFieldBlock">
          <CustomizeSlider
            id="cz-vcpu"
            label={s.vcpu.label}
            unit={s.vcpu.unit}
            min={s.vcpu.min}
            max={s.vcpu.max}
            step={s.vcpu.step}
            value={vcpu}
            icon={<HiCpuChip size={14} />}
            onChange={setVcpu}
          />
          <CustomizeSlider
            id="cz-ram"
            label={s.ramGb.label}
            unit={s.ramGb.unit}
            min={s.ramGb.min}
            max={s.ramGb.max}
            step={s.ramGb.step}
            value={ramGb}
            icon={<HiServer size={14} />}
            onChange={setRamGb}
          />
          <CustomizeSlider
            id="cz-nvme"
            label={s.nvmeGb.label}
            unit={s.nvmeGb.unit}
            min={s.nvmeGb.min}
            max={s.nvmeGb.max}
            step={s.nvmeGb.step}
            value={nvmeGb}
            icon={<HiCircleStack size={14} />}
            onChange={setNvmeGb}
          />
          <CustomizeSlider
            id="cz-bw"
            label={s.bandwidthTb.label}
            unit={s.bandwidthTb.unit}
            min={s.bandwidthTb.min}
            max={s.bandwidthTb.max}
            step={s.bandwidthTb.step}
            value={bandwidthTb}
            icon={<HiSignal size={14} />}
            onChange={setBandwidthTb}
          />
        </div>

        <div className="czFieldBlock">
          <p className="czFieldLabel">Add-ons</p>
          <div className="czToggleList">
            <label className="czToggle">
              <input
                type="checkbox"
                checked={dedicatedIpv4}
                onChange={(e) => setDedicatedIpv4(e.target.checked)}
              />
              <span className="czToggleIcon" aria-hidden>
                <HiGlobeAlt size={15} />
              </span>
              <span className="czToggleName">
                {CUSTOMIZE.addons.dedicatedIpv4.label}
              </span>
              <span className="czToggleHint">
                {CUSTOMIZE.addons.dedicatedIpv4.hint}
              </span>
            </label>
            <label className="czToggle">
              <input
                type="checkbox"
                checked={automatedBackups}
                onChange={(e) => setAutomatedBackups(e.target.checked)}
              />
              <span className="czToggleIcon" aria-hidden>
                <HiCloud size={15} />
              </span>
              <span className="czToggleName">
                {CUSTOMIZE.addons.automatedBackups.label}
              </span>
              <span className="czToggleHint">
                {CUSTOMIZE.addons.automatedBackups.hint}
              </span>
            </label>
          </div>
        </div>
      </div>

      <CustomizePriceCard
        family={family}
        familyLabel={familyLabel}
        region={selectedRegion}
        term={term}
        vcpu={vcpu}
        ramGb={ramGb}
        nvmeGb={nvmeGb}
        bandwidthTb={bandwidthTb}
        dedicatedIpv4={dedicatedIpv4}
        automatedBackups={automatedBackups}
        price={price}
        {...(plansHref ? { plansHref } : {})}
      />
    </div>
  );
}
