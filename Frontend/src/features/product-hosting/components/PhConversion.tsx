/**
 * Closing CTA — scrolls to pricing only (no fake connectors).
 */
type PhConversionProps = {
  heading: string;
  support: string;
  ctaLabel: string;
};

export function PhConversion({
  heading,
  support,
  ctaLabel,
}: PhConversionProps) {
  return (
    <section className="phConvert" aria-labelledby="ph-convert-heading">
      <div className="phInner">
        <h2 id="ph-convert-heading" className="phHeading">
          {heading}
        </h2>
        <p className="phIntro">{support}</p>
        <div className="phHeroCtas">
          <a className="phBtn phBtn--primary" href="#vps-pricing">
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
