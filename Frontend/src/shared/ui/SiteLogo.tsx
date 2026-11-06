/**
 * Theme-aware RunRacks brand lockup.
 * R mark SVG + RUNRACKS wordmark (header/footer). Compare sizes are mark-only.
 * Light/dark assets stay in the DOM so SSR and client HTML match.
 */
import { nourdHeading } from "@/styles/fonts";
import "@/shared/ui/site-logo.css";

type SiteLogoSize = "header" | "footer" | "compare" | "compareSm";

const SIZE_CLASS: Record<SiteLogoSize, string> = {
  header: "siteLogo--header",
  footer: "siteLogo--footer",
  compare: "siteLogo--compare",
  compareSm: "siteLogo--compareSm",
};

const WORDMARK_DEFAULT: Record<SiteLogoSize, boolean> = {
  header: true,
  footer: true,
  compare: false,
  compareSm: false,
};

type SiteLogoProps = {
  size: SiteLogoSize;
  /** Override: header/footer include wordmark; compare stays mark-only. */
  wordmark?: boolean;
};

function MarkImgs({ labeled }: { labeled: boolean }) {
  return (
    <span className="siteLogoMark" aria-hidden={labeled ? undefined : true}>
      {/* eslint-disable @next/next/no-img-element -- local brand SVGs */}
      <img
        className="siteLogoImg siteLogoLight"
        src="/brand/runracks-logo-light.svg"
        alt={labeled ? "RunRacks" : ""}
      />
      <img
        className="siteLogoImg siteLogoDark"
        src="/brand/runracks-logo-dark.svg"
        alt=""
        aria-hidden="true"
      />
      {/* eslint-enable @next/next/no-img-element */}
    </span>
  );
}

function Wordmark() {
  return (
    <span className={`siteLogoWord ${nourdHeading.className}`}>
      <span className="siteLogoRun">RUN</span>
      <span className="siteLogoRacks">RACKS</span>
    </span>
  );
}

export function SiteLogo({ size, wordmark }: SiteLogoProps) {
  const showWord = wordmark ?? WORDMARK_DEFAULT[size];

  return (
    <span
      className={
        showWord
          ? `siteLogo siteLogo--wordmark ${SIZE_CLASS[size]}`
          : `siteLogo ${SIZE_CLASS[size]}`
      }
    >
      <MarkImgs labeled={!showWord} />
      {showWord ? <Wordmark /> : null}
    </span>
  );
}
