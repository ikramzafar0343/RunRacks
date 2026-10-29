"use client";

/**
 * FAQ band — ScrollTrigger batch reveal on accordion items.
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

type ContactFaqMotionProps = {
  children: ReactNode;
};

export function ContactFaqMotion({ children }: ContactFaqMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const heading = root.querySelector(".vpsFaqHeading");
      const items = gsap.utils.toArray<HTMLElement>(
        ".vpsFaqList > li",
        root,
      );

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([heading, ...items], { clearProps: "all", opacity: 1 });
        return;
      }

      if (heading) {
        gsap.fromTo(
          heading,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: root,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      if (!items.length) return;

      gsap.set(items, { opacity: 0, y: 28 });

      ScrollTrigger.batch(items, {
        start: "top 90%",
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            overwrite: true,
          });
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, {
            opacity: 0,
            y: 28,
            duration: 0.35,
            stagger: 0.04,
            overwrite: true,
          });
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="contactFaqMotion">
      {children}
    </div>
  );
}
