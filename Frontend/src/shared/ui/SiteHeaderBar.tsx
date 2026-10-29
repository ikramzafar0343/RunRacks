"use client";

/**
 * Interactive header: dropdowns, theme toggle, mobile menu, actions.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
  HiChevronDown,
  HiMoon,
  HiOutlineUserCircle,
  HiSun,
  HiBars3,
  HiXMark,
} from "react-icons/hi2";
import {
  isNavDropdown,
  type HeaderActions,
  type PrimaryNavItem,
} from "@/shared/config/navConfig";
import { subscribeScrollFrame } from "@/shared/lib/scrollFrame";
import {
  applyTheme,
  useDocumentTheme,
  type DocumentTheme,
} from "@/shared/lib/useDocumentTheme";
import "@/shared/ui/site-header.css";
import "@/shared/ui/site-header-mobile.css";

function isBlogNavActive(pathname: string, href: string): boolean {
  if (href === "/blog") {
    return pathname === "/blog" || pathname.startsWith("/blog/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

type SiteHeaderBarProps = {
  primaryNav: readonly PrimaryNavItem[];
  headerActions: HeaderActions;
};

export function SiteHeaderBar({
  primaryNav,
  headerActions,
}: SiteHeaderBarProps) {
  const pathname = usePathname() ?? "";
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useDocumentTheme();
  const [isPill, setIsPill] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const menuId = useId();

  useEffect(() => {
    let active = false;
    return subscribeScrollFrame(() => {
      const y = window.scrollY;
      // Hysteresis: commit later, release earlier — avoids flicker
      const next = active ? y > SCROLL_PILL_EXIT : y > SCROLL_PILL_ENTER;
      if (next !== active) {
        active = next;
        setIsPill(next);
      }
    });
  }, []);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function toggleTheme() {
    const next: DocumentTheme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    window.localStorage.setItem("theme", next);
  }

  return (
    <header
      ref={rootRef}
      className={isPill ? "siteHeader siteHeader--pill" : "siteHeader"}
    >
      <div className="siteHeaderInner">
        <Link href={headerActions.home.href} className="siteHeaderBrand">
          {headerActions.home.label}
        </Link>

        <nav className="siteHeaderNav" aria-label="Primary navigation">
          {primaryNav.map((item) => {
            if (!isNavDropdown(item)) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="siteHeaderLink"
                  aria-current={
                    isBlogNavActive(pathname, item.href) ? "page" : undefined
                  }
                >
                  {item.label}
                </Link>
              );
            }

            const isOpen = openMenu === item.label;
            const panelId = `${menuId}-${item.label}`;
            const dropActive = item.children.some((child) =>
              isBlogNavActive(pathname, child.href),
            );

            return (
              <div key={item.label} className="siteHeaderDrop">
                <button
                  type="button"
                  className="siteHeaderDropTrigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-current={dropActive ? "true" : undefined}
                  onClick={() => setOpenMenu(isOpen ? null : item.label)}
                >
                  {item.label}
                  <HiChevronDown size={16} aria-hidden="true" />
                </button>
                {isOpen ? (
                  <div id={panelId} className="siteHeaderMenu" role="menu">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        role="menuitem"
                        aria-current={
                          isBlogNavActive(pathname, child.href)
                            ? "page"
                            : undefined
                        }
                        onClick={() => setOpenMenu(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="siteHeaderActions">
          <Link href={headerActions.ai.href} className="siteHeaderAi">
            {headerActions.ai.label}
          </Link>

          <button
            type="button"
            className="siteHeaderIconBtn"
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <HiSun size={18} aria-hidden="true" />
            ) : (
              <HiMoon size={18} aria-hidden="true" />
            )}
          </button>

          <Link
            href={headerActions.profile.href}
            className="siteHeaderIconBtn"
            aria-label={headerActions.profile.label}
          >
            <HiOutlineUserCircle size={20} aria-hidden="true" />
          </Link>

          <button
            type="button"
            className="siteHeaderIconBtn siteHeaderMenuToggle"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls={`${menuId}-mobile`}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? (
              <HiXMark size={20} aria-hidden="true" />
            ) : (
              <HiBars3 size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div id={`${menuId}-mobile`} className="siteHeaderMobile">
          {primaryNav.map((item) => {
            if (!isNavDropdown(item)) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={
                    isBlogNavActive(pathname, item.href) ? "page" : undefined
                  }
                  onClick={() => setMobileOpen(false)}
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
                        isBlogNavActive(pathname, child.href)
                          ? "page"
                          : undefined
                      }
                      onClick={() => setMobileOpen(false)}
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
            onClick={() => setMobileOpen(false)}
          >
            {headerActions.ai.label}
          </Link>
        </div>
      ) : null}
    </header>
  );
}

/** Enter pill after a deliberate scroll; exit sooner when returning to top. */
const SCROLL_PILL_ENTER = 140;
const SCROLL_PILL_EXIT = 48;
