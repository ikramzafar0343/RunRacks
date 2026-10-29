"use client";

/**
 * Form band — ScrollTrigger scrub split + Observer tilt on portrait media.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";
import { ContactForm } from "@/features/contact/components/ContactForm";
import { CONTACT_FORM } from "@/features/contact/model/contactContent";

gsap.registerPlugin(ScrollTrigger, Observer);

const TILT = 5;

export function ContactFormSection() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const panel = root.querySelector<HTMLElement>("[data-form-panel]");
      const media = root.querySelector<HTMLElement>("[data-form-media]");
      const mediaImg = root.querySelector<HTMLElement>("[data-form-media-img]");
      const glow = root.querySelector("[data-form-glow]");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([panel, media, glow], { clearProps: "all", opacity: 1 });
        return;
      }

      gsap.set(panel, { opacity: 0, x: -36 });
      gsap.set(media, { opacity: 0, x: 36, rotateY: 10 });
      gsap.set(glow, { opacity: 0, scale: 0.8 });

      const enter = gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            end: "top 35%",
            toggleActions: "play none none reverse",
          },
        })
        .to(glow, { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" })
        .to(
          panel,
          { opacity: 1, x: 0, duration: 0.85, ease: "power3.out" },
          0.1,
        )
        .to(
          media,
          { opacity: 1, x: 0, rotateY: 0, duration: 0.95, ease: "power3.out" },
          0.15,
        );

      if (mediaImg) {
        gsap.fromTo(
          mediaImg,
          { scale: 1.16, yPercent: -8 },
          {
            scale: 1,
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.75,
            },
          },
        );
      }

      if (!media) {
        return () => {
          enter.scrollTrigger?.kill();
          enter.kill();
        };
      }

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
        enter.scrollTrigger?.kill();
        enter.kill();
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="contact-form"
      className="contactSection contactFormBlock"
      aria-labelledby="contact-form-heading"
    >
      <div className="contactFormGlow" data-form-glow aria-hidden />
      <div className="contactInner contactFormLayout">
        <div data-form-panel>
          <ContactForm />
        </div>
        <div className="contactFormMedia" data-form-media>
          <div className="contactFormMediaFrame" data-form-media-img>
            <Image
              src={CONTACT_FORM.image.src}
              alt={CONTACT_FORM.image.alt}
              fill
              sizes="(max-width: 899px) 100vw, 38vw"
              className="contactFormMediaImg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
