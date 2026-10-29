/**
 * How We Work — RunRacks hosting journey and default board positions.
 */

export type ProcessStepId =
  "family" | "region" | "plans" | "access" | "start" | "support";

export type ProcessTheme = "lime" | "ink";

export type ProcessPosition = { x: number; y: number };

export type ProcessStep = {
  id: ProcessStepId;
  number: string;
  name: string;
  theme: ProcessTheme;
  details: readonly [string, string, string];
  outcome: string;
  defaultPosition: ProcessPosition;
  /** Taller cards for selected stages. */
  tall?: boolean;
};

export const PROCESS_BOARD = { width: 1100, height: 775 } as const;

export const PROCESS_CARD = {
  width: 231,
  height: 171,
  tallHeight: 190,
} as const;

export const PROCESS_INTRO = {
  eyebrow: "HOW WE WORK",
  titleLine1: "Clear hosting.",
  titleLine2: "From plan to production.",
  description:
    "Choose a hosting family, pick a region, and size an NVMe plan with the access you need—then get help from engineers who run the fleet.",
  ctaLabel: "View plans",
  ctaHref: "/pricing",
} as const;

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    id: "family",
    number: "01",
    name: "Choose family",
    theme: "lime",
    details: ["Linux VPS", "Windows VPS", "Admin RDP"],
    outcome: "A hosting family that fits the workload",
    defaultPosition: { x: 0, y: 292 },
  },
  {
    id: "region",
    number: "02",
    name: "Pick region",
    theme: "ink",
    details: [
      "Catalog locations",
      "United States & peers",
      "Same plan language",
    ],
    outcome: "A region selected for your audience",
    defaultPosition: { x: 234, y: 22 },
  },
  {
    id: "plans",
    number: "03",
    name: "Compare plans",
    theme: "lime",
    details: ["vCPU, RAM, NVMe", "Billing terms", "Demo-labeled prices"],
    outcome: "A plan size you can act on",
    defaultPosition: { x: 261, y: 274 },
    tall: true,
  },
  {
    id: "access",
    number: "04",
    name: "Root access",
    theme: "ink",
    details: [
      "Full admin where the family allows",
      "Install your stack",
      "You manage the guest",
    ],
    outcome: "Clear control after launch",
    defaultPosition: { x: 261, y: 562 },
    tall: true,
  },
  {
    id: "start",
    number: "05",
    name: "View plans",
    theme: "lime",
    details: [
      "Open the pricing page",
      "Compare demo-labeled tiers",
      "No fake checkout claims",
    ],
    outcome: "A plan you can compare",
    defaultPosition: { x: 558, y: 292 },
  },
  {
    id: "support",
    number: "06",
    name: "Engineer help",
    theme: "ink",
    details: [
      "Humans who run the fleet",
      "Migration guidance",
      "Support when you need it",
    ],
    outcome: "Help without the chatbot maze",
    defaultPosition: { x: 828, y: 283 },
    tall: true,
  },
] as const;

export const PROCESS_CONNECTIONS: readonly [ProcessStepId, ProcessStepId][] = [
  ["family", "region"],
  ["region", "plans"],
  ["plans", "access"],
  ["access", "start"],
  ["start", "support"],
];
