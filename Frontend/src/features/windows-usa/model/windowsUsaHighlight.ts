/**
 * Windows USA split highlight — image + copy (static, honest messaging).
 */

export const WINDOWS_USA_HIGHLIGHT = {
  heading: "Clear control after you launch",
  body: "Windows VPS in the United States with administrator access where the family allows, NVMe plan cards you can compare, and engineers who run the fleet when you need a human—not a maze of chatbots.",
  image: {
    src: "/images/showcase/rail-photo-operator.jpg",
    alt: "Operator reviewing a hosting workflow on a laptop",
    width: 1200,
    height: 800,
  },
  toasts: [
    {
      id: "ready",
      variant: "pill" as const,
      label: "Windows plans ready to compare",
    },
    {
      id: "access",
      variant: "card" as const,
      label: "Administrator access where allowed",
    },
  ],
} as const;
