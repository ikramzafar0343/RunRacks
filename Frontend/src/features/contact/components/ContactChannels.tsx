"use client";

/**
 * Channel grid — ScrollTrigger stagger + GSAP Observer pointer tilt.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useRef } from "react";
import { CONTACT_CHANNELS } from "@/features/contact/model/contactContent";

gsap.registerPlugin(ScrollTrigger, Observer);

const TILT_MAX = 6;

export function ContactChannels() {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const grid = gridRef.current;
      if (!root || !grid) return;

      const heading = root.querySelector("[data-channels-heading]");
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-channel-card]",
        grid,
      );
      if (!cards.length) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([heading, ...cards], { clearProps: "all", opacity: 1 });
        return;
      }

      gsap.set(heading, { opacity: 0, y: 28 });
      gsap.set(cards, {
        opacity: 0,
        y: 48,
        rotateX: 8,
        transformPerspective: 1000,
      });

      const enter = gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            end: "top 40%",
            toggleActions: "play none none reverse",
          },
        })
        .to(heading, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
        .to(
          cards,
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.35",
        );

      cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>("[data-channel-img]");
        if (!img) return;
        gsap.fromTo(
          img,
          { scale: 1.18, yPercent: -6 },
          {
            scale: 1,
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.7,
            },
          },
        );
      });

      let active: HTMLElement | null = null;

      const resetCard = (el: HTMLElement) => {
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          boxShadow:
            "0 1px 0 color-mix(in srgb, var(--color-heading) 4%, transparent), 0 10px 28px color-mix(in srgb, var(--color-heading) 6%, transparent)",
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
          y: -6,
          boxShadow:
            "0 18px 40px color-mix(in srgb, var(--color-heading) 14%, transparent)",
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const pickCard = (clientX: number, clientY: number) => {
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
        }
        return null;
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
          if (!next) {
            if (active) {
              resetCard(active);
              active = null;
            }
            return;
          }
          if (active && active !== next) resetCard(active);
          active = next;
          tiltToward(next, clientX, clientY);
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
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="contactSection contactChannels"
      aria-labelledby="contact-channels-heading"
    >
      <div className="contactInner">
        <h2
          id="contact-channels-heading"
          className="contactChannelsHeading"
          data-channels-heading
        >
          How can we help?
        </h2>
        <ul ref={gridRef} className="contactChannelGrid">
          {CONTACT_CHANNELS.map((channel, index) => (
            <li key={channel.id}>
              <Link
                href={channel.href as Route}
                className="contactChannelCard"
                data-channel-card
              >
                <span className="contactChannelIndex" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="contactChannelCopy">
                  <h3 className="contactChannelTitle">{channel.title}</h3>
                  <p className="contactChannelBody">{channel.body}</p>
                  <span className="contactChannelCta">{channel.ctaLabel}</span>
                </div>
                <div className="contactChannelMedia">
                  <Image
                    className="contactChannelMediaImg"
                    data-channel-img
                    src={channel.imageSrc}
                    alt={channel.imageAlt}
                    fill
                    sizes="(max-width: 719px) 90vw, 220px"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
