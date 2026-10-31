import { cn } from "@/lib/utils";

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-3 fill-current", className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function TrustpilotBlock() {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      {/* 5 Green squares with white stars */}
      <div
        className="flex items-center gap-[3px]"
        aria-label="5 out of 5 stars on Trustpilot"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="flex size-[18px] items-center justify-center rounded-[2px] bg-[#00b67a]"
          >
            <StarIcon className="size-2.5 fill-white text-white" />
          </span>
        ))}
      </div>

      {/* Trustpilot logo + score + review count */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-body sm:text-[13px]">
        <span className="inline-flex items-center gap-1 font-bold text-heading">
          {/* Trustpilot 2-color star icon */}
          <svg
            className="size-3.5 fill-[#00b67a]"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2l2.6 7.9h8.3l-6.7 4.9 2.6 7.9-6.8-4.9-6.8 4.9 2.6-7.9-6.7-4.9h8.3L12 2z" />
          </svg>
          Trustpilot
        </span>
        <span className="font-bold text-heading">4.8</span>
        <span className="text-body/75">out of 5</span>
        <span className="font-bold text-heading">7,254</span>
        <span className="text-body/75">reviews</span>
      </div>
    </div>
  );
}

function GoogleBlock() {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      {/* 5 Green stars (4 full + 1 70% filled) */}
      <div
        className="flex items-center gap-[2px]"
        aria-label="4.7 out of 5 stars on Google"
      >
        {[1, 2, 3, 4, 5].map((slot) => {
          const fillPercent = slot <= 4 ? 100 : 70;
          return (
            <span
              key={slot}
              className="relative inline-flex size-4 items-center justify-center"
            >
              <StarIcon className="size-4 fill-emerald-100 text-emerald-100 dark:fill-emerald-950/60 dark:text-emerald-950/60" />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <StarIcon className="size-4 fill-[#00b67a] text-[#00b67a]" />
              </span>
            </span>
          );
        })}
      </div>

      {/* Google logo + score + review count */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-body sm:text-[13px]">
        <span className="font-heading font-semibold tracking-tight text-heading">
          Google
        </span>
        <span className="font-bold text-heading">4.7</span>
        <span className="text-body/75">out of 5</span>
        <span className="font-bold text-heading">3,123</span>
        <span className="text-body/75">reviews</span>
      </div>
    </div>
  );
}

function HostAdviceBlock() {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      {/* 5 Green stars (4 full + 1 60% filled) */}
      <div
        className="flex items-center gap-[2px]"
        aria-label="4.6 out of 5 stars on HostAdvice"
      >
        {[1, 2, 3, 4, 5].map((slot) => {
          const fillPercent = slot <= 4 ? 100 : 60;
          return (
            <span
              key={slot}
              className="relative inline-flex size-4 items-center justify-center"
            >
              <StarIcon className="size-4 fill-emerald-100 text-emerald-100 dark:fill-emerald-950/60 dark:text-emerald-950/60" />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <StarIcon className="size-4 fill-[#00b67a] text-[#00b67a]" />
              </span>
            </span>
          );
        })}
      </div>

      {/* hostadvice logo + score + review count */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-body sm:text-[13px]">
        <span className="font-heading italic tracking-tight text-heading">
          <strong className="font-bold">host</strong>
          <span className="font-normal opacity-90">advice</span>
        </span>
        <span className="font-bold text-heading">4.6</span>
        <span className="text-body/75">out of 5</span>
        <span className="font-bold text-heading">1,902</span>
        <span className="text-body/75">reviews</span>
      </div>
    </div>
  );
}

export function PricingTrustBand({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-4xl rounded-2xl border border-border/70 bg-surface/90 px-6 py-4.5 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.06)] backdrop-blur-md dark:bg-card/90 dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.3)]",
        className,
      )}
    >
      {/* Main Trust Statistic Headline — demo figures only */}
      <p className="text-center text-xs font-normal text-heading/90 sm:text-sm md:text-[15px] tracking-tight">
        Trusted by over{" "}
        <strong className="font-semibold text-heading">700,000</strong>{" "}
        customers to power{" "}
        <strong className="font-semibold text-heading">3,000,000+</strong>{" "}
        websites!
      </p>
      <p className="mt-1.5 text-center text-[11px] text-body/70" role="note">
        Demo trust metrics — not verified production figures
      </p>

      {/* 3 Review & Rating Badges with subtle vertical dividers */}
      <div className="mt-4 grid grid-cols-1 items-center justify-items-center gap-3 sm:mt-4.5 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border/50">
        <div className="w-full px-2 sm:px-4">
          <TrustpilotBlock />
        </div>
        <div className="w-full px-2 sm:px-4">
          <GoogleBlock />
        </div>
        <div className="w-full px-2 sm:px-4">
          <HostAdviceBlock />
        </div>
      </div>
    </div>
  );
}
