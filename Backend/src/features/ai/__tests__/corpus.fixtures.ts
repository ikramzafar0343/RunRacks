/**
 * Advisor regression corpus — test-only fixtures (no invented live prices).
 */
export type UtteranceCase = {
  id: string;
  message: string;
  expectPrimary?: string;
  expectTextIncludes?: string[];
  expectTextExcludes?: string[];
  expectTemplate?: string;
};

export type DialogueTurn = {
  message: string;
  expectTextIncludes?: string[];
  expectTextExcludes?: string[];
};

export type DialogueCase = {
  id: string;
  turns: DialogueTurn[];
};

/** ≥50 single-turn utterances covering greetings, discover, products, policy, setup. */
export const UTTERANCES: UtteranceCase[] = [
  { id: "g1", message: "hi", expectPrimary: "greeting", expectTextIncludes: ["host"] },
  { id: "g2", message: "Hello", expectPrimary: "greeting" },
  { id: "g3", message: "hey there", expectPrimary: "greeting" },
  { id: "g4", message: "ELLLLLOW", expectPrimary: "greeting", expectTextExcludes: ["Pricing", "catalog cache"] },
  { id: "g5", message: "how are you", expectPrimary: "greeting" },
  { id: "g6", message: "salam", expectPrimary: "greeting" },
  { id: "g7", message: "Hi!", expectPrimary: "greeting" },
  { id: "c1", message: "what can you do", expectPrimary: "capabilities", expectTextIncludes: ["advisor"] },
  { id: "c2", message: "who are you", expectPrimary: "capabilities" },
  { id: "d1", message: "Best hosting plan for Pakistan", expectPrimary: "discover", expectTextIncludes: ["website", "application", "desktop"], expectTextExcludes: ["catalog cache", "I will not invent"] },
  { id: "d2", message: "I need hosting", expectPrimary: "discover" },
  { id: "d3", message: "hosting chahiye", expectPrimary: "discover" },
  { id: "d4", message: "recommend a plan", expectPrimary: "discover" },
  { id: "d5", message: "best plan for my site", expectPrimary: "discover" },
  { id: "d6", message: "mujhe hosting chahiye pakistan", expectPrimary: "discover" },
  { id: "d7", message: "sasta hosting chahiye", expectPrimary: "discover" },
  { id: "d8", message: "need hosting for wordpress", expectPrimary: "discover" },
  { id: "p1", message: "linux vps", expectPrimary: "linux_vps", expectTextExcludes: ["catalog cache"] },
  { id: "p2", message: "Help me choose a Linux VPS.", expectPrimary: "linux_vps" },
  { id: "p3", message: "ubuntu server", expectPrimary: "linux_vps" },
  { id: "p4", message: "windows vps", expectPrimary: "windows_vps" },
  { id: "p5", message: "Help me choose a Windows VPS.", expectPrimary: "windows_vps" },
  { id: "p6", message: "admin rdp", expectPrimary: "admin_rdp" },
  { id: "p7", message: "remote desktop", expectPrimary: "admin_rdp" },
  { id: "p8", message: "Help me choose an Admin RDP plan.", expectPrimary: "admin_rdp" },
  { id: "pr1", message: "how much does vps cost", expectPrimary: "pricing", expectTextIncludes: ["Pricing"], expectTextExcludes: ["catalog cache"] },
  { id: "pr2", message: "pricing", expectPrimary: "pricing" },
  { id: "pr3", message: "kitni price hai", expectPrimary: "pricing" },
  { id: "pr4", message: "what is the cost", expectPrimary: "pricing" },
  { id: "cm1", message: "compare linux and windows vps", expectPrimary: "compare" },
  { id: "cm2", message: "linux vs windows", expectPrimary: "compare" },
  { id: "cm3", message: "difference between vps and rdp", expectPrimary: "compare" },
  { id: "t1", message: "ssh not working", expectPrimary: "troubleshoot", expectTextExcludes: ["password"] },
  { id: "t2", message: "cannot login via rdp", expectPrimary: "troubleshoot" },
  { id: "t3", message: "dns not resolving", expectPrimary: "troubleshoot" },
  { id: "t4", message: "ssl certificate error", expectPrimary: "troubleshoot" },
  { id: "t5", message: "connection error on server", expectPrimary: "troubleshoot" },
  { id: "pol1", message: "do you have ddos protection", expectPrimary: "policy", expectTextIncludes: ["Contact"] },
  { id: "pol2", message: "refund policy", expectPrimary: "policy" },
  { id: "pol3", message: "what is your sla", expectPrimary: "policy" },
  { id: "pol4", message: "are backups included", expectPrimary: "policy" },
  { id: "ct1", message: "open a ticket", expectPrimary: "contact", expectTextIncludes: ["contact"] },
  { id: "ct2", message: "I need support", expectPrimary: "contact" },
  { id: "ct3", message: "contact sales", expectPrimary: "contact" },
  { id: "ct4", message: "fix my server please", expectPrimary: "contact" },
  { id: "u1", message: "asdfghjkl", expectTextIncludes: ["hosting"] },
  { id: "u2", message: "tell me a joke", expectTextExcludes: ["catalog"] },
  { id: "u3", message: "weather in karachi", expectTextExcludes: ["$0"] },
  { id: "mx1", message: "hi I need hosting", expectPrimary: "discover" },
  { id: "mx2", message: "hello windows vps please", expectPrimary: "windows_vps" },
  {
    id: "b1",
    message: "hosting under USD 20 per month",
    expectPrimary: "pricing",
    expectTextIncludes: ["within about", "20"],
  },

  { id: "b2", message: "not windows, need linux hosting", expectPrimary: "discover" },
  { id: "fr1", message: "this is useless you keep repeating the same answer", expectTextIncludes: ["directly"] },
];

/** ≥12 multi-turn dialogues (screenshot + follow-ups). */
export const DIALOGUES: DialogueCase[] = [
  {
    id: "pk_discover",
    turns: [
      {
        message: "Best hosting plan for Pakistan",
        expectTextIncludes: ["website", "application"],
        expectTextExcludes: ["catalog cache"],
      },
      {
        message: "DO FOR ME",
        expectTextIncludes: ["website", "desktop"],
      },
      {
        message: "Website",
        expectTextExcludes: ["catalog cache"],
      },
    ],
  },
  {
    id: "greet_then_hosting",
    turns: [
      { message: "hi", expectTextIncludes: ["host"] },
      { message: "I need hosting for an application" },
    ],
  },
  {
    id: "typo_greet",
    turns: [
      { message: "ELLLLLOW", expectTextExcludes: ["Pricing"] },
      { message: "linux vps" },
    ],
  },
  {
    id: "correction_os",
    turns: [
      { message: "I need hosting", expectTextIncludes: ["website"] },
      { message: "website" },
      { message: "actually not windows", expectTextExcludes: ["silently"] },
    ],
  },
  {
    id: "budget_follow",
    turns: [
      { message: "best hosting plan" },
      { message: "website under $15 monthly" },
    ],
  },
  {
    id: "budget_ten_dollars",
    turns: [
      {
        message: "my budget is 10 dollars show all the plans inside that",
        expectTextIncludes: ["VPS 1", "Windows VPS 1", "10/mo"],
        expectTextExcludes: ["Admin RDP 1"],
      },
    ],
  },
  {
    id: "spec_build_card",
    turns: [
      {
        message:
          "create plan cpu is 1 ram is 4 storage is 30 and bandwidth is 40",
        expectTextIncludes: [
          "Customize",
          "1 vCPU",
          "4 GB RAM",
          "30 GB storage",
          "20 TB",
          "Which type",
        ],
        expectTextExcludes: ["VPS 1", "scale your VPS", "/mo"],
      },
    ],
  },



  {
    id: "rdp_path",
    turns: [
      { message: "hosting chahiye" },
      { message: "Remote Windows desktop" },
    ],
  },
  {
    id: "pricing_empty",
    turns: [
      {
        message: "how much does it cost",
        expectTextIncludes: ["Pricing"],
        expectTextExcludes: ["catalog cache"],
      },
      { message: "linux vps pricing" },
    ],
  },
  {
    id: "setup_ssh",
    turns: [
      { message: "ssh not working", expectTextExcludes: ["password"] },
      { message: "still cannot connect" },
    ],
  },
  {
    id: "compare_then_price",
    turns: [
      { message: "compare linux and windows vps" },
      { message: "pricing please", expectTextExcludes: ["catalog cache"] },
    ],
  },
  {
    id: "contact_limit",
    turns: [
      { message: "open a ticket", expectTextIncludes: ["contact"] },
      { message: "please create the ticket for me" },
    ],
  },
  {
    id: "frustration_recover",
    turns: [
      { message: "Best hosting plan for Pakistan" },
      { message: "Best hosting plan for Pakistan" },
      {
        message: "you keep repeating the same answer not helping",
        expectTextIncludes: ["directly"],
      },
    ],
  },
  {
    id: "roman_urdu",
    turns: [
      { message: "mujhe hosting chahiye" },
      { message: "website wali" },
      { message: "windows nahi" },
    ],
  },
];
