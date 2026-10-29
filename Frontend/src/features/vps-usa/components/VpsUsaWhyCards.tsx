"use client";

/**
 * Why-host cards — ScrollTrigger stagger + Observer pointer tilt.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, Observer);

export type UsaWhyReason = {
  id: string;
  title: string;
  body: string;
};

type VpsUsaWhyCardsProps = {
  reasons: readonly UsaWhyReason[];
};

const TILT_MAX = 5.5;

function indexLabel(i: number) {
  return String(i + 1).padStart(2, "0");
}

export function VpsUsaWhyCards({ reasons }: VpsUsaWhyCardsProps) {
  const gridRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-usa-why-card]",
        grid,
      );
      if (!cards.length) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (reduce.matches) {
        gsap.set(cards, {
          clearProps: "all",
          opacity: 1,
          y: 0,
          rotateX: 0,
          rotateY: 0,
        });
        return;
      }

      gsap.set(cards, { opacity: 0, y: 36, transformPerspective: 900 });

      const enter = gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: grid,
          start: "top 80%",
          once: true,
        },
      });

      let active: HTMLElement | null = null;

      const resetCard = (el: HTMLElement) => {
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const tiltToward = (
        el: HTMLElement,
        clientX: number,
        clientY: number,
      ) => {
        const rect = el.getBoundingClientRect();
        const px = (clientX - rect.left) / rect.width - 0.5;
        const py = (clientY - rect.top) / rect.height - 0.5;
        gsap.to(el, {
          rotateY: gsap.utils.clamp(-TILT_MAX, TILT_MAX, px * TILT_MAX * 2),
          rotateX: gsap.utils.clamp(-TILT_MAX, TILT_MAX, -py * TILT_MAX * 2),
          y: -4,
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const pickCard = (clientX: number, clientY: number) => {
        let best: HTMLElement | null = null;
        let bestDist = Number.POSITIVE_INFINITY;
        for (const card of cards) {
          const r = card.getBoundingClientRect();
          if (
            clientX >= r.left &&
            clientX <= r.right &&
            clientY >= r.top &&
            clientY <= r.bottom
          ) {
            return card;
          }
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const d = (clientX - cx) ** 2 + (clientY - cy) ** 2;
          if (d < bestDist) {
            bestDist = d;
            best = card;
          }
        }
        return best;
      };

      const observer = Observer.create({
        target: grid,
        type: "pointer,touch",
        onMove: (self) => {
          const ev = self.event as PointerEvent | TouchEvent;
          let clientX = 0;
          let clientY = 0;
          if ("clientX" in ev) {
            clientX = ev.clientX;
            clientY = ev.clientY;
          } else if (ev.touches[0]) {
            clientX = ev.touches[0].clientX;
            clientY = ev.touches[0].clientY;
          } else {
            return;
          }

          const next = pickCard(clientX, clientY);
          if (!next) return;
          if (active && active !== next) resetCard(active);
          active = next;
          tiltToward(next, clientX, clientY);
        },
        onHover: (self) => {
          const ev = self.event as PointerEvent;
          if (!("clientX" in ev)) return;
          const next = pickCard(ev.clientX, ev.clientY);
          if (!next) return;
          active = next;
          tiltToward(next, ev.clientX, ev.clientY);
        },
        onHoverEnd: () => {
          if (active) resetCard(active);
          active = null;
          for (const card of cards) resetCard(card);
        },
        onStop: () => {
          if (active) resetCard(active);
        },
      });

      return () => {
        observer.kill();
        enter.scrollTrigger?.kill();
        enter.kill();
      };
    },
    { scope: gridRef, dependencies: [reasons] },
  );

  return (
    <ul ref={gridRef} className="usaWhyList" aria-label="Why host in the US">
      {reasons.map((reason, i) => (
        <li key={reason.id} className="usaWhyItem">
          <article
            className="usaWhyCard"
            data-usa-why-card
            tabIndex={0}
            aria-labelledby={`usa-why-${reason.id}`}
          >
            <p className="usaWhyIndex" aria-hidden>
              {indexLabel(i)}
            </p>
            <h3 id={`usa-why-${reason.id}`} className="usaWhyTitle">
              {reason.title}
            </h3>
            <p className="usaWhyBody">{reason.body}</p>
          </article>
        </li>
      ))}
    </ul>
  );
}
