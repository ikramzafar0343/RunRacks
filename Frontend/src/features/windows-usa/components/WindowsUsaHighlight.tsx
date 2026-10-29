/**
 * Split highlight — lifestyle asset + toast chips + copy (light/dark Sage).
 */
import Image from "next/image";
import { Check } from "lucide-react";
import { WINDOWS_USA_HIGHLIGHT } from "@/features/windows-usa/model/windowsUsaHighlight";
import "@/features/windows-usa/components/windows-usa-highlight.css";

export function WindowsUsaHighlight() {
  const { heading, body, image, toasts } = WINDOWS_USA_HIGHLIGHT;

  return (
    <section
      id="windows-usa-highlight"
      className="winHighlight"
      aria-labelledby="windows-usa-highlight-heading"
    >
      <div className="winHighlightInner">
        <div className="winHighlightMedia">
          <div className="winHighlightFrame">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="winHighlightImg"
              sizes="(max-width: 1023px) 100vw, 48vw"
            />
            <ul className="winHighlightToasts" aria-hidden>
              {toasts.map((t) => (
                <li
                  key={t.id}
                  className={`winHighlightToast winHighlightToast--${t.variant}`}
                >
                  {t.variant === "pill" ? (
                    <Check
                      className="winHighlightToastIcon"
                      size={16}
                      strokeWidth={2.5}
                      aria-hidden
                    />
                  ) : null}
                  <span>{t.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="winHighlightCopy">
          <h2
            id="windows-usa-highlight-heading"
            className="winHighlightHeading"
          >
            {heading}
          </h2>
          <p className="winHighlightBody">{body}</p>
        </div>
      </div>
    </section>
  );
}
