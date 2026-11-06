/**
 * Chat Q&A JSONL — questions only. Assistant text is discarded so SLA,
 * JazzCash, free-backup, and similar claims never enter the phrase bank.
 */
import { readFileSync } from "node:fs";
import { normalizeForMatch } from "../pipeline/normalize.js";
import { resolvePackFile } from "./packPaths.js";
import {
  answerForTraining,
  loadTrainingQuestions,
} from "./trainingSheet.js";
import { CATALOG, CONTACT, DEMO, say } from "./trainingFacts.js";
import { sheetSignalReply } from "./trainingSpecific.js";

type Hit = { id: string; answer: string };

type ChatRow = {
  messages?: Array<{ role?: string; content?: string }>;
};

let cachedQuestions: string[] | null = null;
let categoryByMatch: Map<string, string> | null = null;

export function loadQaAnswerQuestions(): string[] {
  if (cachedQuestions) return cachedQuestions;
  const raw = readFileSync(resolvePackFile("qaAnswersChat.jsonl"), "utf8");
  const questions: string[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const row = JSON.parse(trimmed) as ChatRow;
    const user = row.messages?.find((m) => m.role === "user")?.content?.trim();
    if (!user) continue;
    questions.push(user);
  }
  if (questions.length !== 2744) {
    throw new Error(`qaAnswersChat expected 2744 questions, got ${questions.length}`);
  }
  cachedQuestions = questions;
  return questions;
}

function trainingCategoryIndex(): Map<string, string> {
  if (categoryByMatch) return categoryByMatch;
  const map = new Map<string, string>();
  for (const row of loadTrainingQuestions()) {
    map.set(normalizeForMatch(row.question).matching, row.category);
  }
  categoryByMatch = map;
  return map;
}

function guessCategory(matching: string): string {
  const m = matching;
  if (/roman|urdu|\bkya\b|\bhai\b|\bkitne\b|\bsasta\b/.test(m)) {
    return "Roman Urdu Mein Aam Sawal";
  }
  if (/better than|hostinger|contabo|vultr|linode|lightsail|fiverr|objection/.test(m)) {
    return "Comparisons & Objections";
  }
  if (/affiliate|reseller|commission|white-label|whitelabel/.test(m)) {
    return "Affiliate & Reseller";
  }
  if (/terms of service|privacy policy|refund policy|\bgdpr\b|\bkyc\b|legal/.test(m)) {
    return "Policies, Legal & Privacy";
  }
  if (/server is down|not responding|500|502|503|504|troubleshoot|won't start/.test(m)) {
    return "Troubleshooting";
  }
  if (/support|ticket|whatsapp|24\/7|live chat/.test(m)) {
    return "Support & Tickets";
  }
  if (/allowed|prohibited|mining|torrent|aup|acceptable use/.test(m)) {
    return "Allowed & Prohibited Use";
  }
  if (/domain|dns|nameserver|email hosting|spf|dkim/.test(m)) {
    return "Domains, DNS & Email";
  }
  if (/cpanel|plesk|control panel|cyberpanel|wordpress install/.test(m)) {
    return "Control Panels & Software";
  }
  if (/backup|snapshot/.test(m)) return "Backups & Snapshots";
  if (/ddos|firewall|fail2ban|hacked|ssl certificate/.test(m)) {
    return "Security, DDoS & Firewall";
  }
  if (/upgrade|downgrade/.test(m)) return "Upgrades & Downgrades";
  if (/slow|cpu usage|ram usage|nvme|oversell|performance/.test(m)) {
    return "Performance & Resources";
  }
  if (/\bip\b|bandwidth|port 25|ipv6|rdns/.test(m)) {
    return "Network, IP & Bandwidth";
  }
  if (/reinstall|operating system|iso|rescue/.test(m)) {
    return "Operating Systems & Reinstall";
  }
  if (/ssh|rdp connect|putty|login|password reset|vnc/.test(m)) {
    return "Server Access & Login";
  }
  if (/setup|provision|welcome email|migrate/.test(m)) {
    return "Setup & Activation";
  }
  if (/renew|cancel|refund|money-back|money back/.test(m)) {
    return "Renewals, Cancellation & Refunds";
  }
  if (/invoice|billing|due date|grace period/.test(m)) {
    return "Invoices & Billing";
  }
  if (/account|client area|2fa|sign in|password/.test(m)) {
    return "Account & Client Area";
  }
  if (/order|checkout|coupon|place an order/.test(m)) {
    return "Ordering & Checkout";
  }
  if (/pay|payment|visa|paypal|jazzcash|easypaisa|crypto/.test(m)) {
    return "Payment Methods";
  }
  if (/price|pricing|cheapest|cost|usd|pkr|discount/.test(m)) {
    return "Pricing & Plans";
  }
  if (/location|data center|region|ping|singapore|germany/.test(m)) {
    return "Locations & Data Centers";
  }
  if (/\brdp\b|remote desktop/.test(m)) return "RDP";
  if (/windows vps|windows server/.test(m)) return "Windows VPS";
  if (/linux vps|ubuntu|debian|almalinux/.test(m)) return "Linux VPS";
  if (/which plan|wordpress|forex|minecraft|recommend/.test(m)) {
    return "Choosing a Plan (Pre-sales)";
  }
  return "General / About RunRacks";
}

function outOfScope(matching: string): boolean {
  return /\bjoke\b|\bweather\b|\basdf|\bpoem\b|\blyrics\b|\bsing a song\b/.test(
    matching,
  );
}

const OUT_OF_SCOPE =
  "I can help with RunRacks hosting choices, verified prices when available, and basic setup checks. What do you need help with?";

export function honestAnswerForQuestion(question: string): string {
  const matching = normalizeForMatch(question).matching;
  if (outOfScope(matching)) return OUT_OF_SCOPE;
  const signal = sheetSignalReply(matching);
  if (signal) return signal.trim();
  const category =
    trainingCategoryIndex().get(matching) ?? guessCategory(matching);
  return (
    answerForTraining(category, matching).trim() ||
    say(CATALOG, DEMO, CONTACT)
  );
}

export function addQaAnswerPhrases(
  map: Map<string, Hit>,
  register: (
    map: Map<string, Hit>,
    phrase: string,
    hit: Hit,
    overwrite?: boolean,
  ) => boolean,
): number {
  let added = 0;
  const tails = ["", " please", " thanks"];
  let i = 0;
  for (const question of loadQaAnswerQuestions()) {
    i += 1;
    const hit = {
      id: `qa-chat-${i}`,
      answer: honestAnswerForQuestion(question),
    };
    for (const tail of tails) {
      if (register(map, `${question}${tail}`, hit, false)) added += 1;
    }
  }
  return added;
}
