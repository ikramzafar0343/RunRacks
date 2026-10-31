/**
 * Windows USA split highlight — image + copy (static, honest messaging).
 */

export const WINDOWS_USA_HIGHLIGHT = {
  heading: "Administrator control on US Windows plans",
  body: "Compare NVMe-backed Windows VPS tiers with administrator access, then talk to RunRacks engineers when you need a human path forward—not a chatbot maze.",
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
