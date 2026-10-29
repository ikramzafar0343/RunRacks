/**
 * Global site footer — brand, link columns, watermark, legal bar.
 */
import Link from "next/link";
import { FOOTER } from "@/shared/config/footerConfig";
import { FooterNavColumns } from "@/shared/ui/FooterNavColumns";
import { FooterSocial } from "@/shared/ui/FooterSocial";
import "@/shared/ui/site-footer.css";
import "@/shared/ui/site-footer-social.css";
import "@/shared/ui/site-footer-accordion.css";
import "@/shared/ui/site-footer-responsive.css";

export function SiteFooter() {
  return (
    <footer className="siteFooter" aria-labelledby="site-footer-brand">
      <div className="siteFooterGlow" aria-hidden="true" />
      <div className="siteFooterInner">
        <div className="siteFooterBrandBlock">
          <Link href="/" className="siteFooterBrand" id="site-footer-brand">
            <span className="siteFooterBrandName">{FOOTER.brand}</span>
            <span className="siteFooterBrandTag">{FOOTER.tagline}</span>
          </Link>
          <FooterSocial items={FOOTER.social} />
        </div>

        <div className="siteFooterRule" aria-hidden="true" />

        <div className="siteFooterMain">
          <p className="siteFooterWatermark" aria-hidden="true">
            {FOOTER.watermark}
          </p>

          <div className="siteFooterGrid">
            <div className="siteFooterCol siteFooterContact">
              <h2 className="siteFooterColTitle">Contact us</h2>
              <p className="siteFooterBlurb">{FOOTER.contactBlurb}</p>
              <Link
                href={FOOTER.contactCta.href}
                className="siteFooterContactLink"
              >
                {FOOTER.contactCta.label}
              </Link>
            </div>

            <FooterNavColumns columns={FOOTER.columns} />
          </div>
        </div>

        <div className="siteFooterBottom">
          <nav className="siteFooterLegal" aria-label="Legal">
            {FOOTER.legal.map((item, index) => (
              <span key={item.href} className="siteFooterLegalItem">
                {index > 0 ? (
                  <span className="siteFooterLegalSep" aria-hidden="true">
                    |
                  </span>
                ) : null}
                <Link href={item.href} className="siteFooterLegalLink">
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
          <p className="siteFooterCopy">{FOOTER.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
