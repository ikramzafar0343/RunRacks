/**
 * High-risk sheet replies. These also answer close paraphrases.
 * Patterns are kept off the advisor regression utterances.
 */
import {
  BACKUP,
  BILL,
  CHEAP,
  CONTACT,
  DDOS,
  DEMO,
  NO_LEGAL,
  NOT_SOLD,
  PAY,
  REGIONS,
} from "./trainingFacts.js";
import { romanReply } from "./trainingRoman.js";

function riskReply(matching: string): string | null {
  const m = matching;
  if (/\b(sla|uptime guarantee|money-back|money back)\b/.test(m)) return NO_LEGAL;
  if (/\brefund\b/.test(m)) return `${NO_LEGAL} I cannot start a refund from chat.`;
  const wallet =
    /\b(jazzcash|easypaisa|sadapay|nayapay|payoneer|skrill|usdt|bitcoin|crypto|visa|mastercard|paypal|apple pay|google pay)\b/;
  const paying =
    /\b(pay|paid|payment|checkout|billing|accept|accepted|fee|fees|charge|charged)\b|payment method|bank transfer|debit card|credit card|pakistani card|card detail/;
  if ((wallet.test(m) && paying.test(m)) || /payment method|bank transfer|debit card|credit card|pakistani card/.test(m)) {
    if (/declin|charged twice|deducted|unpaid|didn.t pay|payment failed/.test(m)) {
      return `I cannot see a charge, a decline, or an invoice status. ${PAY} ${CONTACT}`;
    }
    return PAY;
  }
  if (/what is the ping|lowest ping|ping from|fastest from|kam ping/.test(m)) {
    return `I will not give a ping number or rank regions by latency. Regions on every card: ${REGIONS}.`;
  }
  if (/\b(backup|snapshot|clone my vps)\b/.test(m)) return BACKUP;
  if (/\b(ddos|null-rout|null route)\b/.test(m)) return DDOS;
  if (/\b(affiliate|reseller|commission|white-label|whitelabel)\b/.test(m)) {
    return `No affiliate program, reseller discount, commission, cookie, or payout method is published. I will not invent a rate. ${CONTACT}`;
  }
  if (
    /\b(gpu|shared hosting|dedicated server|game server hosting|managed vps)\b/.test(
      m,
    ) ||
    /domain registration/.test(m)
  ) {
    return `${NOT_SOLD} ${CHEAP}`;
  }
  if (/\b(cheapest|lowest price|lowest demo)\b/.test(m)) return CHEAP;
  if (/\b(pkr|coupon|promo code|black friday|setup fee|hidden charge)\b/.test(m)) {
    return `No PKR rate, coupon, Black Friday deal, setup fee, or hidden-charge schedule is published. ${BILL} ${DEMO}`;
  }
  if (/\bfree trial\b|\bdemo server\b|\blooking glass\b/.test(m)) {
    return `No free trial, demo server, or looking-glass address is published. ${DEMO}`;
  }
  if (
    /\b(hostinger|contabo|vultr|digitalocean|linode|lightsail|hetzner|fiverr)\b/.test(
      m,
    ) ||
    /better than|cheaper than/.test(m)
  ) {
    return `I will not claim RunRacks is better or cheaper than another company, and I will not invent their price, SLA, or refund terms. ${CHEAP}`;
  }
  if (/\b(kvm|openvz|nested virtualization)\b/.test(m)) {
    return "KVM, OpenVZ, and nested virtualization are not stated on the plan cards. I will not pick one.";
  }
  if (/windows server 2019|windows server 2022|windows server 2025|windows 10|windows 11|windows 7/.test(m)) {
    return "I will not confirm a Windows build or that a license is included. The card says Windows Server, image selected at order.";
  }
  if (/cpanel license|plesk license|directadmin|litespeed license|softaculous/.test(m)) {
    return "No control-panel license or license price is in this catalog. On a root server you can install software you license yourself. That is not a support promise.";
  }
  if (/\b(port 25|ipv6|rdns|reverse dns|byoip)\b/.test(m)) {
    return "IPv6 counts, reverse DNS, port 25, and bring-your-own-IP are not confirmed. Linux cards list a dedicated IPv4. I will not quote an extra-IP price.";
  }
  if (/\b(mining|torrent|phishing|bulk email|iptv|dmca-ignored)\b/.test(m) || /spam allowed|send spam/.test(m)) {
    return `The acceptable-use policy is not published. I will not say mining, torrents, spam, phishing, or DMCA-ignored hosting are allowed. ${CONTACT}`;
  }
  if (/\b(metatrader|mt4|mt5|forex)\b/.test(m)) {
    return `MetaTrader and forex bots are a Windows workload people run on Windows VPS or Admin RDP. That is not a latency or profit promise. ${CHEAP}`;
  }
  if (/reinstall/.test(m) && /delete|wipe|lose|data/.test(m)) {
    return "Reinstall is not a live action from chat. Reinstalling an OS normally erases the disk. I cannot promise the IP or password stays the same.";
  }
  if (/24\/7|24 7|whatsapp support|phone support|reply time|how fast does support/.test(m)) {
    return `I will not promise 24/7 cover, a reply time, WhatsApp, or phone support. ${CONTACT}`;
  }
  if (/\binvoice\b/.test(m)) {
    return `I cannot see, create, or download invoices, and I cannot state a due date, late fee, grace period, or suspension timer. ${CONTACT}`;
  }
  if (/which (us|uk) city|what city|servers in pakistan|servers in india|servers in dubai|servers in france|hong kong/.test(m)) {
    return `I do not have a city, and Pakistan, India, the UAE, France, and Hong Kong are not in the region list. Regions: ${REGIONS}.`;
  }
  if (/tier 3|tier 4|gdpr compliant/.test(m)) {
    return `I will not claim a tier rating or GDPR compliance. Regions on the cards: ${REGIONS}.`;
  }
  return null;
}

export function sheetSignalReply(matching: string): string | null {
  return romanReply(matching) ?? riskReply(matching);
}
