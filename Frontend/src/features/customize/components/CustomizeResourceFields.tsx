/**
 * Customize sliders + add-ons block.
 */
import {
  HiCircleStack,
  HiCloud,
  HiCpuChip,
  HiGlobeAlt,
  HiServer,
  HiSignal,
} from "react-icons/hi2";
import { CustomizeSlider } from "@/features/customize/components/CustomizeSlider";
import { CUSTOMIZE } from "@/features/customize/model/customizeContent";

type CustomizeResourceFieldsProps = {
  vcpu: number;
  ramGb: number;
  nvmeGb: number;
  bandwidthTb: number;
  dedicatedIpv4: boolean;
  automatedBackups: boolean;
  onVcpu: (value: number) => void;
  onRam: (value: number) => void;
  onNvme: (value: number) => void;
  onBandwidth: (value: number) => void;
  onIpv4: (value: boolean) => void;
  onBackups: (value: boolean) => void;
};

export function CustomizeResourceFields({
  vcpu,
  ramGb,
  nvmeGb,
  bandwidthTb,
  dedicatedIpv4,
  automatedBackups,
  onVcpu,
  onRam,
  onNvme,
  onBandwidth,
  onIpv4,
  onBackups,
}: CustomizeResourceFieldsProps) {
  const s = CUSTOMIZE.sliders;
  return (
    <>
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
          onChange={onVcpu}
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
          onChange={onRam}
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
          onChange={onNvme}
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
          onChange={onBandwidth}
        />
      </div>

      <div className="czFieldBlock">
        <p className="czFieldLabel">Add-ons</p>
        <div className="czToggleList">
          <label className="czToggle">
            <input
              type="checkbox"
              checked={dedicatedIpv4}
              onChange={(e) => onIpv4(e.target.checked)}
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
              onChange={(e) => onBackups(e.target.checked)}
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
    </>
  );
}
