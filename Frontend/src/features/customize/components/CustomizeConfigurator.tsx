/**
 * Client configurator — icons, flags, bordered controls, demo price.
 */
"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useMemo, useState } from "react";
import { HiGlobeAlt, HiOutlineCalendarDays, HiServer } from "react-icons/hi2";
import { useCart } from "@/features/cart/lib/CartProvider";
import { CustomizePriceCard } from "@/features/customize/components/CustomizePriceCard";
import { CustomizeRegionSelect } from "@/features/customize/components/CustomizeRegionSelect";
import { CustomizeResourceFields } from "@/features/customize/components/CustomizeResourceFields";
import { familyIcon } from "@/features/customize/components/customizeIcons";
import {
  attachedRamGb,
  CUSTOMIZE,
} from "@/features/customize/model/customizeContent";
import { calculateCustomizePrice } from "@/features/customize/model/customizePricing";
import type {
  BillingTermMonths,
  VpsFamily,
  VpsRegion,
} from "@/features/vps-pricing/model/types";
import { NOTIFY_COPY } from "@/shared/ui/notify/notifyCopy";
import { useNotify } from "@/shared/ui/notify/NotifyProvider";
import "@/features/customize/components/customize.css";
import "@/features/customize/components/customize-summary.css";

export type CustomizeConfiguratorProps = {
  regions: readonly VpsRegion[];
  defaultRegionId: string;
  plansHref?: string;
  lockedFamily?: VpsFamily;
};

export function CustomizeConfigurator({
  regions,
  defaultRegionId,
  plansHref,
  lockedFamily,
}: CustomizeConfiguratorProps) {
  const router = useRouter();
  const { addFromCustomize } = useCart();
  const { toast } = useNotify();
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
  const ramFloor = attachedRamGb(vcpu);

  function handleChoosePlan() {
    const result = addFromCustomize({
      locationId: regionId || defaultRegionId || "us",
      term,
      custom: {
        family,
        label: familyLabel,
        vcpu,
        ramGb,
        nvmeGb,
        bandwidthTb,
        dedicatedIpv4,
        automatedBackups,
        monthlyMinor: price.monthlyMinor,
        termTotalMinor: price.termTotalMinor,
        currency: price.currency,
      },
    });
    if (!result.ok) {
      toast({ tone: "warning", ...NOTIFY_COPY.cartFull });
      return;
    }
    toast({ tone: "success", ...NOTIFY_COPY.addedCustom(familyLabel) });
    router.push("/cart" as Route);
  }

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

        <CustomizeResourceFields
          vcpu={vcpu}
          ramGb={ramGb}
          nvmeGb={nvmeGb}
          bandwidthTb={bandwidthTb}
          dedicatedIpv4={dedicatedIpv4}
          automatedBackups={automatedBackups}
          onVcpu={(next) => {
            setVcpu(next);
            setRamGb(attachedRamGb(next));
          }}
          onRam={(next) => setRamGb(Math.max(next, ramFloor))}
          onNvme={setNvmeGb}
          onBandwidth={setBandwidthTb}
          onIpv4={setDedicatedIpv4}
          onBackups={setAutomatedBackups}
        />
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
        onChoosePlan={handleChoosePlan}
        {...(plansHref ? { plansHref } : {})}
      />
    </div>
  );
}
