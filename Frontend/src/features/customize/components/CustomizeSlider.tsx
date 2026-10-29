/**
 * Accessible range control with optional leading icon.
 */
"use client";

import type { ReactNode } from "react";
import "@/features/customize/components/customize-slider.css";

export type CustomizeSliderProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon?: ReactNode;
  onChange: (value: number) => void;
};

export function CustomizeSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  unit,
  icon,
  onChange,
}: CustomizeSliderProps) {
  const span = max - min || 1;
  const fill = ((value - min) / span) * 100;

  return (
    <div className="czSlider">
      <div className="czSliderHead">
        <label className="czSliderLabel" htmlFor={id}>
          {icon ? (
            <span className="czSliderIcon" aria-hidden>
              {icon}
            </span>
          ) : null}
          {label}
        </label>
        <p className="czSliderValue" aria-live="polite">
          {value} {unit}
        </p>
      </div>
      <div className="czSliderTrackWrap">
        <input
          id={id}
          className="czSliderInput"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value} ${unit}`}
          style={{ ["--cz-fill" as string]: `${fill}%` }}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
