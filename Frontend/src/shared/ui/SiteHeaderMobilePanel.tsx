/**
 * Mobile drawer links for SiteHeaderBar.
 */
import Link from "next/link";
import {
  isNavDropdown,
  type HeaderActions,
  type PrimaryNavItem,
} from "@/shared/config/navConfig";
import { scrollToTopPinned } from "@/shared/lib/scrollToTop";

function isBlogNavActive(pathname: string, href: string): boolean {
  if (href === "/blog") {
    return pathname === "/blog" || pathname.startsWith("/blog/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SiteHeaderMobilePanelProps = {
  id: string;
  pathname: string;
  primaryNav: readonly PrimaryNavItem[];
  headerActions: HeaderActions;
  onClose: () => void;
};

export function SiteHeaderMobilePanel({
  id,
  pathname,
  primaryNav,
  headerActions,
  onClose,
}: SiteHeaderMobilePanelProps) {
  function go(hrefOnClick?: () => void) {
    onClose();
    hrefOnClick?.();
    scrollToTopPinned();
  }

  return (
    <div id={id} className="siteHeaderMobile">
      {primaryNav.map((item) => {
        if (!isNavDropdown(item)) {
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                isBlogNavActive(pathname, item.href) ? "page" : undefined
              }
              onClick={() => go()}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <div key={item.label}>
            <div className="siteHeaderMobileGroup">{item.label}</div>
            <div className="siteHeaderMobileSub">
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  aria-current={
                    isBlogNavActive(pathname, child.href) ? "page" : undefined
                  }
                  onClick={() => go()}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
      <Link
        href={headerActions.ai.href}
        className="siteHeaderMobileAi"
        onClick={() => go()}
      >
        {headerActions.ai.label}
      </Link>
    </div>
  );
}
