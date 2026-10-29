"use client";

/**
 * Contact hero — GSAP entrance, ScrollTrigger parallax, Observer tilt on media.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { CONTACT_HERO } from "@/features/contact/model/contactContent";

gsap.registerPlugin(ScrollTrigger, Observer);

const TILT = 4.5;

export function ContactHero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const eyebrow = root.querySelector("[data-hero-eyebrow]");
      const brand = root.querySelector("[data-hero-brand]");
      const lead = root.querySelector("[data-hero-lead]");
      const actions = root.querySelector("[data-hero-actions]");
      const media = root.querySelector<HTMLElement>("[data-hero-media]");
      const mediaImg = root.querySelector<HTMLElement>("[data-hero-media-img]");
      const wash = root.querySelector("[data-hero-wash]");
      const orbs = root.querySelectorAll("[data-hero-orb]");
      const copyBits = [eyebrow, brand, lead, actions];

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([...copyBits, media, wash, orbs], {
          clearProps: "all",
          opacity: 1,
        });
        return;
      }

      gsap.set(copyBits, { opacity: 0, y: 40 });
      gsap.set(media, {
        opacity: 0,
        scale: 1.08,
        rotateY: -8,
        transformPerspective: 1000,
      });
      gsap.set(wash, { opacity: 0, scale: 0.92 });
      gsap.set(orbs, { opacity: 0, scale: 0.6 });

      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .to(wash, { opacity: 1, scale: 1, duration: 1.1 }, 0)
        .to(orbs, { opacity: 1, scale: 1, duration: 0.9, stagger: 0.12 }, 0.15)
        .to(eyebrow, { opacity: 1, y: 0, duration: 0.55 }, 0.05)
        .to(brand, { opacity: 1, y: 0, duration: 0.9 }, 0.12)
        .to(lead, { opacity: 1, y: 0, duration: 0.75 }, 0.3)
        .to(actions, { opacity: 1, y: 0, duration: 0.6 }, 0.44)
        .to(
          media,
          { opacity: 1, scale: 1, rotateY: 0, duration: 1.05 },
          0.22,
        );

      const parallax = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.65,
        },
      });
      parallax
        .to(mediaImg, { yPercent: 14, scale: 1.12, ease: "none" }, 0)
        .to(orbs, { y: 80, ease: "none" }, 0)
        .to(wash, { opacity: 0.35, ease: "none" }, 0);

      if (!media) return;

      const resetTilt = () => {
        gsap.to(media, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const observer = Observer.create({
        target: media,
        type: "pointer,touch",
        onMove: (self) => {
          const ev = self.event as PointerEvent | TouchEvent;
          const point =
            "clientX" in ev
              ? ev
              : ev.touches[0]
                ? ev.touches[0]
                : null;
          if (!point) return;
          const rect = media.getBoundingClientRect();
          const px = (point.clientX - rect.left) / rect.width - 0.5;
          const py = (point.clientY - rect.top) / rect.height - 0.5;
          gsap.to(media, {
            rotateY: gsap.utils.clamp(-TILT, TILT, px * TILT * 2),
            rotateX: gsap.utils.clamp(-TILT, TILT, -py * TILT * 2),
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        },
        onHoverEnd: resetTilt,
        onStop: resetTilt,
      });

      return () => {
        observer.kill();
        intro.kill();
        parallax.scrollTrigger?.kill();
        parallax.kill();
      };
    },
    { scope: rootRef },
  );

  return (
    <header ref={rootRef} className="contactHero">
      <div className="contactHeroWash" data-hero-wash aria-hidden />
      <span className="contactHeroOrb contactHeroOrb--a" data-hero-orb aria-hidden />
      <span className="contactHeroOrb contactHeroOrb--b" data-hero-orb aria-hidden />
      <span className="contactHeroOrb contactHeroOrb--c" data-hero-orb aria-hidden />
      <div className="contactInner contactHeroGrid">
        <div className="contactHeroCopy">
          <p className="contactHeroEyebrow" data-hero-eyebrow>
            RunRacks
          </p>
          <h1 className="contactHeroBrand" data-hero-brand>
            {CONTACT_HERO.brand}
          </h1>
          <p className="contactHeroLead" data-hero-lead>
            {CONTACT_HERO.lead}
          </p>
          <div className="contactHeroActions" data-hero-actions>
            <Link href={CONTACT_HERO.primary.href} className="aboutBtnPrimary">
              {CONTACT_HERO.primary.label}
            </Link>
            <Link
              href={CONTACT_HERO.secondary.href}
              className="aboutBtnSecondary"
            >
              {CONTACT_HERO.secondary.label}
            </Link>
          </div>
        </div>
        <div className="contactHeroMedia" data-hero-media>
          <div className="contactHeroMediaFrame" data-hero-media-img>
            <Image
              src={CONTACT_HERO.image.src}
              alt={CONTACT_HERO.image.alt}
              fill
              priority
              sizes="(max-width: 899px) 100vw, 42vw"
              className="contactHeroMediaImg"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
