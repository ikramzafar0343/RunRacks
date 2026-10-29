"use client";

/**
 * Showcase carousel controls — prev / counter / next / pause + progress.
 */
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

export type WindowsUsaShowcaseControlsProps = {
  activeIndex: number;
  slideCount: number;
  playing: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
};

export function WindowsUsaShowcaseControls({
  activeIndex,
  slideCount,
  playing,
  onPrevious,
  onNext,
  onTogglePlay,
}: WindowsUsaShowcaseControlsProps) {
  const progressPct = ((activeIndex + 1) / slideCount) * 100;

  return (
    <div className="winShowcaseFooter" data-win-footer>
      <div
        className="winShowcaseNav"
        aria-label="Windows hosting showcase carousel controls"
      >
        <button
          type="button"
          className="winShowcaseNavBtn"
          aria-label="Previous slide"
          onClick={onPrevious}
        >
          <ChevronLeft size={16} strokeWidth={1.75} aria-hidden />
        </button>
        <span className="winShowcaseCounter" aria-hidden>
          {activeIndex + 1} / {slideCount}
        </span>
        <button
          type="button"
          className="winShowcaseNavBtn"
          aria-label="Next slide"
          onClick={onNext}
        >
          <ChevronRight size={16} strokeWidth={1.75} aria-hidden />
        </button>
        <button
          type="button"
          className="winShowcaseNavBtn"
          aria-label={
            playing
              ? "Pause automatic slide changes"
              : "Resume automatic slide changes"
          }
          onClick={onTogglePlay}
        >
          {playing ? (
            <Pause size={14} strokeWidth={1.75} aria-hidden />
          ) : (
            <Play size={14} strokeWidth={1.75} aria-hidden />
          )}
        </button>
      </div>
      <div
        className="winShowcaseProgress"
        role="progressbar"
        aria-label="Carousel slide position"
        aria-valuemin={1}
        aria-valuemax={slideCount}
        aria-valuenow={activeIndex + 1}
        aria-valuetext={`Slide ${activeIndex + 1} of ${slideCount}`}
      >
        <span
          className="winShowcaseProgressFill"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}
