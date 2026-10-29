/**
 * Footer social row — brand marks with flanking rules.
 * Links render only when a verified href is present.
 */
import type { ComponentType } from "react";
import {
  FaBehance,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";
import type {
  FooterSocialId,
  FooterSocialLink,
} from "@/shared/config/footerConfig";

const SOCIAL_ICONS: Record<
  FooterSocialId,
  ComponentType<{ className?: string; "aria-hidden"?: boolean }>
> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  youtube: FaYoutube,
  linkedin: FaLinkedinIn,
  behance: FaBehance,
};

type FooterSocialProps = {
  items: readonly FooterSocialLink[];
};

export function FooterSocial({ items }: FooterSocialProps) {
  if (items.length === 0) return null;

  return (
    <div className="siteFooterSocialWrap">
      <span className="siteFooterSocialRail" aria-hidden="true" />
      <ul className="siteFooterSocial" aria-label="RunRacks on social media">
        {items.map((item) => {
          const Icon = SOCIAL_ICONS[item.id];
          if (item.href) {
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="siteFooterSocialLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.label} (opens in a new tab)`}
                >
                  <Icon aria-hidden={true} />
                </a>
              </li>
            );
          }

          return (
            <li key={item.id}>
              <span
                className="siteFooterSocialLink siteFooterSocialLinkMuted"
                title={`${item.label} — profile link not published yet`}
                aria-label={`${item.label} (not published yet)`}
              >
                <Icon aria-hidden={true} />
              </span>
            </li>
          );
        })}
      </ul>
      <span className="siteFooterSocialRail" aria-hidden="true" />
    </div>
  );
}
