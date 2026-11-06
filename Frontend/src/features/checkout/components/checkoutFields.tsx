/**
 * Shared checkout inputs. Card data is never given a real autocomplete token.
 */
import Image from "next/image";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { flagSrc } from "@/features/customize";
import type { VpsRegion } from "@/features/vps-pricing";

export function CheckoutTextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  name,
  autoComplete,
  required = false,
  full = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  name?: string;
  autoComplete?: string;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <div className={full ? "checkoutFieldFull" : undefined}>
      <label className="checkoutLabel" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="checkoutInput"
        type={type}
        name={name}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </div>
  );
}

export function CheckoutPasswordField({
  id,
  label,
  autoComplete,
  value,
  onChange,
  shown,
  onToggle,
  minLength,
  hint,
}: {
  id: string;
  label: string;
  autoComplete: "new-password" | "current-password";
  value: string;
  onChange: (value: string) => void;
  shown: boolean;
  onToggle: () => void;
  minLength?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className="checkoutLabel" htmlFor={id}>
        {label}
      </label>
      <div className="checkoutPasswordWrap">
        <input
          id={id}
          className="checkoutInput"
          type={shown ? "text" : "password"}
          name="password"
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          minLength={minLength}
        />
        <button
          type="button"
          className="checkoutEyeBtn"
          aria-label={shown ? "Hide password" : "Show password"}
          onClick={onToggle}
        >
          {shown ? <HiEyeSlash size={16} /> : <HiEye size={16} />}
        </button>
      </div>
      {hint ? <p className="checkoutHint">{hint}</p> : null}
    </div>
  );
}

export function CheckoutCountryPicker({
  labelId,
  regions,
  activeId,
  onSelect,
}: {
  labelId: string;
  regions: readonly VpsRegion[];
  activeId: string;
  onSelect: (regionId: string) => void;
}) {
  return (
    <div
      className="checkoutCountrySeg"
      role="radiogroup"
      aria-labelledby={labelId}
    >
      {regions.map((region) => {
        const active = region.id === activeId;
        return (
          <button
            key={region.id}
            type="button"
            role="radio"
            className="checkoutCountryBtn"
            aria-checked={active}
            data-active={active ? "true" : "false"}
            onClick={() => onSelect(region.id)}
          >
            <Image
              src={flagSrc(region.countryCode)}
              alt=""
              width={18}
              height={12}
              className="checkoutCountryFlag"
              unoptimized
            />
            {region.name}
          </button>
        );
      })}
    </div>
  );
}
