"use client";

/**
 * Admin RDP use cases — interactive list + detail panel (Sage & Ink / Nourd).
 */
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import {
  Bot,
  ChartLine,
  ChevronRight,
  Code2,
  Download,
  Palette,
  Server,
  type LucideIcon,
} from "lucide-react";
import {
  ADMIN_RDP,
  type ArdpUseCaseIcon,
} from "@/features/admin-rdp/model/adminRdpContent";
import "@/features/admin-rdp/components/admin-rdp-usecases.css";
import "@/features/admin-rdp/components/admin-rdp-usecases-responsive.css";

const ICONS: Record<ArdpUseCaseIcon, LucideIcon> = {
  server: Server,
  code: Code2,
  bot: Bot,
  download: Download,
  palette: Palette,
  chart: ChartLine,
};

export function ArdpUseCases() {
  const { useCases } = ADMIN_RDP;
  const baseId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);
  /** Per-clip aspect from metadata; shared 9/16 fallback for portrait sources. */
  const [aspectBySrc, setAspectBySrc] = useState<Record<string, string>>({});
  const item = useCases.items[active] ?? useCases.items[0];

  const videoSrc = item?.videoSrc;
  const mediaOnly = Boolean(item?.mediaOnly && videoSrc);
  const videoAspect =
    (videoSrc && aspectBySrc[videoSrc]) || "9 / 16";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    void video.play().catch(() => {
      /* Autoplay may be blocked until gesture; muted loop still loads. */
    });
  }, [videoSrc]);

  function onVideoMeta() {
    const video = videoRef.current;
    if (!videoSrc || !video?.videoWidth || !video.videoHeight) return;
    const next = `${video.videoWidth} / ${video.videoHeight}`;
    setAspectBySrc((prev) =>
      prev[videoSrc] === next ? prev : { ...prev, [videoSrc]: next },
    );
  }

  if (!item) return null;

  const Icon = ICONS[item.icon];
  const caseLabel = `Use case ${String(active + 1).padStart(2, "0")}`;

  function activate(index: number) {
    if (index < 0 || index >= useCases.items.length) return;
    setActive(index);
  }

  function onListKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    let next = active;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      next = (active + 1) % useCases.items.length;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      next = (active - 1 + useCases.items.length) % useCases.items.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = useCases.items.length - 1;
    } else {
      return;
    }
    activate(next);
    document.getElementById(`${baseId}-opt-${next}`)?.focus();
  }

  const cta = (
    <a
      className={
        mediaOnly
          ? "ardpUseCasesCta ardpUseCasesCtaOverlay"
          : "ardpUseCasesCta"
      }
      href={useCases.cta.href}
    >
      {useCases.cta.label}
      <ChevronRight size={16} strokeWidth={2} aria-hidden />
    </a>
  );

  return (
    <section
      className="ardpUseCases"
      aria-labelledby={`${baseId}-title`}
    >
      <div className="ardpUseCasesInner">
        <header className="ardpUseCasesHeader">
          <h2 id={`${baseId}-title`} className="ardpUseCasesTitle">
            {useCases.title}
          </h2>
          <p className="ardpUseCasesSubtitle">{useCases.subtitle}</p>
        </header>

        <div className="ardpUseCasesGrid">
          <div
            className="ardpUseCasesList"
            role="listbox"
            aria-label="Admin RDP use cases"
            aria-activedescendant={`${baseId}-opt-${active}`}
            onKeyDown={onListKeyDown}
          >
            {useCases.items.map((entry, index) => {
              const ItemIcon = ICONS[entry.icon];
              const selected = index === active;
              return (
                <button
                  key={entry.id}
                  id={`${baseId}-opt-${index}`}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  className="ardpUseCasesItem"
                  data-active={selected ? "true" : "false"}
                  onClick={() => activate(index)}
                  onMouseEnter={() => activate(index)}
                >
                  <span className="ardpUseCasesItemIcon" aria-hidden>
                    <ItemIcon size={20} strokeWidth={2} />
                  </span>
                  <span className="ardpUseCasesItemLabel">{entry.title}</span>
                  <ChevronRight
                    className="ardpUseCasesChevron"
                    size={16}
                    strokeWidth={2}
                    aria-hidden
                  />
                </button>
              );
            })}
          </div>

          <div
            className="ardpUseCasesDetail"
            data-media-only={mediaOnly ? "true" : "false"}
            style={
              mediaOnly
                ? ({
                    ["--ardp-video-aspect"]: videoAspect,
                  } as CSSProperties)
                : undefined
            }
            aria-live="polite"
          >
            {videoSrc ? (
              <div
                className={
                  mediaOnly
                    ? "ardpUseCasesMedia ardpUseCasesMediaFill"
                    : "ardpUseCasesMedia"
                }
              >
                <video
                  key={videoSrc}
                  ref={videoRef}
                  className="ardpUseCasesVideo"
                  src={videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedMetadata={onVideoMeta}
                  aria-label={mediaOnly ? item.title : undefined}
                  aria-hidden={mediaOnly ? undefined : true}
                />
              </div>
            ) : null}

            {mediaOnly ? (
              cta
            ) : (
              <div key={item.id} className="ardpUseCasesDetailBody">
                <div className="ardpUseCasesDetailHead">
                  <span className="ardpUseCasesDetailIcon" aria-hidden>
                    <Icon size={28} strokeWidth={2} />
                  </span>
                  <div>
                    <span className="ardpUseCasesEyebrow">{caseLabel}</span>
                    <h3 className="ardpUseCasesDetailTitle">{item.title}</h3>
                  </div>
                </div>
                <p className="ardpUseCasesDetailText">{item.body}</p>
                <div className="ardpUseCasesDivider" aria-hidden />
                <p className="ardpUseCasesToolsLabel">{useCases.toolsLabel}</p>
                <div className="ardpUseCasesTags">
                  {item.tools.map((tool) => (
                    <span key={tool} className="ardpUseCasesTag">
                      <span className="ardpUseCasesTagDot" aria-hidden />
                      {tool}
                    </span>
                  ))}
                </div>
                {cta}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
