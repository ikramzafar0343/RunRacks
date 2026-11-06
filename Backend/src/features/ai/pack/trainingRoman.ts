/**
 * Roman Urdu sheet answers. Same facts as English, no extra claims.
 */
import {
  ACCOUNT,
  BACKUP,
  BILL,
  CHEAP,
  CONTACT,
  DDOS,
  DEMO,
  NO_LEGAL,
  PAY,
  REGIONS,
} from "./trainingFacts.js";

function roman(matching: string): boolean {
  return /\b(kya|hai|kaun|kitne|kitna|kaise|kyun|nahi|nahin|mera|meri|mujhe|sakta|sakti|chahiye|milega|milegi|karoon|karun|milta|milti|bhool|bhej|dikha)\b/.test(
    matching,
  );
}

export function romanReply(matching: string): string | null {
  if (!roman(matching)) return null;
  const m = matching;
  if (/sasta/.test(m) && /\bvps\b/.test(m) && !/\brdp\b/.test(m)) {
    return `Sab se sasta Linux demo price VPS 1 hai, $4.49 mahine (4 vCPU, 6 GB RAM, 100 GB NVMe). ${DEMO}`;
  }
  if (/sasta/.test(m) && /\brdp\b/.test(m)) {
    return `Sab se sasta Admin RDP demo price Admin RDP 1 hai, $10.99 mahine. ${DEMO}`;
  }
  if (/jazzcash|easypaisa/.test(m)) {
    return `JazzCash aur Easypaisa confirm nahi hain. Main koi account number ya payment steps nahi doonga. ${PAY}`;
  }
  if (/kitni der|active kyun|abhi tak/.test(m)) {
    return `Linux card par delivery ka label about 15 minutes hai. Yeh promise nahi ke aapka server ban raha hai. Main order status nahi dekh sakta. ${CONTACT}`;
  }
  if (/rupay|pkr|dollar rate/.test(m)) {
    return `Demo prices USD hain. PKR rate ya Pakistani rupay confirm nahi. ${PAY}`;
  }
  if (/free trial|trial milta/.test(m)) {
    return `Free trial published nahi hai. ${DEMO}`;
  }
  if (/refund/.test(m)) return `Refund ka koi guarantee nahi. ${NO_LEGAL}`;
  if (/farq|rdp aur vps|vps aur rdp/.test(m)) {
    return "Windows VPS Windows services ke liye hai. Admin RDP interactive Windows desktop ke liye hai. Dono demo catalog hain, order nahi.";
  }
  if (/forex|mt4|mt5/.test(m)) {
    return `Forex ya MT4 ke liye Windows VPS ya Admin RDP family dekho. Main speed ya profit promise nahi karta. ${CHEAP}`;
  }
  if (/ping/.test(m)) {
    return `Main Pakistan ya kisi country ka ping number nahi doonga. Regions: ${REGIONS}.`;
  }
  if (/license/.test(m)) {
    return "Windows card yeh nahi kehta ke license shamil hai. Pricing par confirm karein.";
  }
  if (/password/.test(m)) {
    return `Password yahan paste mat karein. Reset connected nahi hai. ${ACCOUNT}`;
  }
  if (/connect nahi|rdp connect/.test(m)) {
    return `Remote Desktop istemal karein, woh address jo aap ko mila ho. Password chat mein mat bhejein. ${CONTACT}`;
  }
  if (/slow/.test(m)) {
    return `Main aapka server nahi dekh sakta aur slow hone ki ek wajah invent nahi karunga. Card par likha RAM aur vCPU compare karein. ${CONTACT}`;
  }
  if (/24 ghante|24\/7|support/.test(m) && /whatsapp|urdu|ghante|support/.test(m)) {
    return `24/7, WhatsApp, ya Urdu support ka promise nahi. ${CONTACT}`;
  }
  if (/setup kar|website shift|shift kar/.test(m)) {
    return `Main aapka server setup ya website migrate nahi kar sakta. ${CONTACT}`;
  }
  if (/torrent|mining|bulk email|email bhej/.test(m)) {
    return `AUP abhi published nahi. Main torrent, mining, ya bulk email ko allowed nahi kahunga. Unlawful kaam na karein. ${CONTACT}`;
  }
  if (/upgrade/.test(m)) {
    return `Bara published plan choose karein. Main upgrade run nahi kar sakta aur data safe rehne ka promise nahi. ${BILL}`;
  }
  if (/cancel/.test(m)) return `Cancel button live nahi. ${NO_LEGAL}`;
  if (/invoice|unpaid|decline|card/.test(m)) {
    return `Main invoice ya card decline nahi dekh sakta. Payment connected nahi hai. ${CONTACT}`;
  }
  if (/zyada log|ek se zyada/.test(m)) {
    return "Main concurrent users ya RDS CAL ka number promise nahi karta.";
  }
  if (/\bip\b/.test(m)) {
    return "Linux cards dedicated IPv4 kehte hain. Extra IP ki price aur IP change fee published nahi.";
  }
  if (/backup/.test(m)) return BACKUP;
  if (/ddos/.test(m)) return DDOS;
  if (/mehfooz|data/.test(m)) {
    return `Privacy policy pending hai. Password chat mein mat bhejein. ${NO_LEGAL}`;
  }
  if (/discount|coupon/.test(m)) {
    return `Coupon ya discount code published nahi. ${BILL}`;
  }
  if (/runracks kya hai|\bkya hai\b/.test(m)) {
    return `RunRacks is catalog mein Linux VPS, Windows VPS, aur Admin RDP hain. ${CHEAP}`;
  }
  return null;
}
