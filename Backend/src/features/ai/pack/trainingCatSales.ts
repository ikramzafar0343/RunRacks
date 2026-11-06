/**
 * Sales and catalog categories from the training-question sheet.
 */
import {
  BILL,
  CATALOG,
  CHEAP,
  CONTACT,
  DEMO,
  NO_LEGAL,
  NOT_SOLD,
  PAY,
  REGIONS,
  firstMatch,
  say,
} from "./trainingFacts.js";

function general(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/how long|years|in business/, "I don't have a verified founding year or years-in-business figure."],
      [/where is runracks|based|headquarter/, "I don't have a verified headquarters city."],
      [/registered|who owns|owner/, "I don't have a verified owner name or company registration number."],
      [/own its own hardware|what hardware|which cpu/, "I will not name a CPU model or claim the hardware is owned by RunRacks."],
      [/ssd|nvme/, "Plan cards list NVMe. I will not add a RAID level or a measured disk speed."],
      [/shared hosting|dedicated server|domain registration|cpanel|game server|gpu|managed/, NOT_SOLD],
      [/uptime|sla/, NO_LEGAL],
      [/status page|outage/, "I don't have a status-page URL."],
      [/review|trustpilot|social/, "I don't have a verified review count, Trustpilot page, or social account."],
      [/contact|business hours/, `Business hours are not published. ${CONTACT}`],
      [/blog|mobile app|\bapi\b|website secure/, "A blog, mobile app, management API, and a security audit are not things I can confirm."],
      [/reliab/, "I will not invent an uptime or reliability statistic."],
      [/different|digitalocean|vultr|contabo|why should i choose/, "I will not claim RunRacks is better than another host or invent their price."],
      [/beginner|business/, "Beginners and businesses use the same three families. Managed setup is not a catalog product."],
      [/managed and unmanaged|managed or unmanaged/, "The cards do not say managed. You get root or administrator access and run the server yourself."],
    ],
    "RunRacks in this catalog is Linux VPS, Windows VPS, and Admin RDP.",
  );
  return say(lead, CATALOG, NOT_SOLD, DEMO, CONTACT);
}

function choosing(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/wordpress|woocommerce|small business website|online store/, "For a website or store, look at Linux VPS. I will not size it from a visitor count."],
      [/forex|trading bot|metatrader|mt4|mt5/, "For a Windows trading app, look at Windows VPS or Admin RDP. I will not promise latency or profit."],
      [/minecraft|game/, "There is no game-server product. A Linux VPS is the closest card, and I will not promise a player count."],
      [/vpn|wireguard|openvpn/, "There is no VPN product. Root access on Linux means you can install your own software. That is not permission for abuse and not a support install."],
      [/node|laravel|php|python|django|docker/, "Those app stacks fit a Linux VPS with root access. I will not promise a framework version."],
      [/how much ram|how many cpu|how much storage|10 000|100 000|visitors/, "I will not convert visitors into a RAM or CPU number. Compare the published cards."],
      [/linux vps or windows|vps or an rdp|vps and rdp|windows vps and rdp/, "Linux VPS is for Linux workloads. Windows VPS is for Windows services. Admin RDP is for an interactive Windows desktop."],
      [/upgrade later|start with a small/, "You can pick a larger published card later. I cannot run the upgrade or promise that data is kept."],
      [/location|pakistan|middle east|europe|india|asia|usa|united states/, `I will not rank regions by ping. Every card lists ${REGIONS}.`],
      [/custom plan|more ram without|extra storage only/, "RAM-only and disk-only add-ons are not separate cards. Tell me CPU, RAM, NVMe, and bandwidth and I will match a published plan card with its labeled demo price."],
      [/free trial|demo server|network speed before|looking glass|test ip/, "No free trial, demo server, or public speed-test host is published."],
      [/money-back|money back/, NO_LEGAL],
      [/multiple servers|bulk|volume discount/, "You can add more than one plan to the configure cart. No bulk discount is published."],
      [/recommend/, "Tell me the workload: Linux site or app, Windows app, or a remote Windows desktop."],
    ],
    "Tell me whether you want a Linux server, a Windows server, or a remote Windows desktop.",
  );
  return say(lead, CHEAP, NO_LEGAL, CONTACT);
}

function locations(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/pakistan|india|dubai|uae|france|hong kong|lahore|karachi/, `That place is not in the region list. I will not invent a nearby-ping winner.`],
      [/which us city|which uk city|what city|specific state|specific city/, "I do not have a city or state for any region."],
      [/ping/, "I will not give a ping number from Pakistan or anywhere else."],
      [/united states|\busa\b|\bus\b/, "United States is one of the eight regions. I do not have a US city."],
      [/united kingdom|\buk\b/, "United Kingdom is one of the eight regions. I do not have a UK city."],
      [/canada/, "Canada is one of the eight regions."],
      [/netherlands/, "Netherlands is one of the eight regions."],
      [/germany/, "Germany is one of the eight regions."],
      [/singapore/, "Singapore is one of the eight regions."],
      [/australia/, "Australia is one of the eight regions."],
      [/japan/, "Japan is one of the eight regions."],
      [/same in all locations|all plans available|move my server|fee to change location|ip change if i change/, "I cannot move a server, quote a location-change fee, or promise the IP stays. Demo prices on the cards are not listed per city."],
      [/tier|gdpr|geolocate|wrong country|forex broker|seo/, "I will not claim a tier rating, GDPR status, or that an IP will geolocate a certain way."],
      [/new location/, "No additional region is published."],
    ],
    "These are the regions printed on every plan card.",
  );
  return say(lead, `Regions: ${REGIONS}.`, DEMO, CONTACT);
}

function pricing(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/cheapest windows|windows vps/, "The lowest Windows demo price is Windows VPS 1 at $8.99/mo (2 vCPU, 4 GB RAM, 40 GB NVMe)."],
      [/cheapest rdp|\brdp\b/, "The lowest Admin RDP demo price is Admin RDP 1 at $10.99/mo (2 vCPU, 4 GB RAM, 60 GB NVMe)."],
      [/cheapest|how much does a vps|how much does vps|linux vps/, "The lowest Linux demo price is VPS 1 at $4.49/mo (4 vCPU, 6 GB RAM, 100 GB NVMe)."],
      [/pkr|usd|currency/, "Demo prices are labeled in USD. A PKR rate is not published."],
      [/setup fee|hidden|tax/, "No setup fee, hidden-charge list, or tax treatment is published."],
      [/windows license included|include the windows/, "The card does not say a Windows license is included in the price."],
      [/include an ip|extra ip|extra bandwidth|extra storage|extra cpu|extra ram/, "Linux cards include one dedicated IPv4. Extra IP, bandwidth, storage, CPU, or RAM prices are not published."],
      [/monthly|quarterly|semi-annual|annual|hourly|discount for annual|renewal price|first month|long-term|2 years/, BILL],
      [/coupon|promotion|black friday|student|non-profit|referral/, "No coupon, student, non-profit, or referral discount is published."],
      [/cheaper than|higher than|match a competitor/, "I will not explain another company's price or match it."],
      [/stopped server|snapshot|reinstall|control panel license/, "Stopped-server billing, snapshot fees, reinstall fees, and panel-license fees are not published."],
    ],
    "Prices below are demo catalog amounts.",
  );
  return say(lead, CHEAP, BILL, CONTACT);
}

function payment(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/jazzcash|easypaisa|sadapay|nayapay|payoneer|wise|skrill|crypto|usdt|bitcoin|apple pay|google pay/, "I cannot confirm that wallet, and I will not give an account number or payment steps."],
      [/declin|pakistani card|international transaction|paypal payment failed|charged twice|deducted|unpaid|not active/, "I cannot see the payment, the decline, or whether an invoice is paid."],
      [/store my card|save my card|saved card|auto-pay|automatic renewal/, "Live payment is not connected, so this chat cannot store a card or toggle auto-pay."],
      [/someone else|someone else's name|add funds|account balance|account credit|receipt|extra fee/, "I cannot confirm account credit, a minimum top-up, a receipt, or a processor surcharge."],
      [/visa|mastercard|debit|paypal|bank transfer|payment method|safe to enter/, PAY],
    ],
    PAY,
  );
  return say(lead, PAY, CONTACT);
}

function ordering(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/how do i order|order a vps|order an rdp|from mobile|24\/7/, "Add the plan to the configure cart from Pricing or this chat. Checkout does not place a paid order."],
      [/create an account|what information|phone number|address|identity|fraud|cancelled|verification|pending|order status|confirmation email/, "I cannot see an order, a fraud review, or a confirmation email. Account registration is not connected."],
      [/coupon/, "No coupon field is a live discount. I cannot validate a code."],
      [/operating system|hostname|location during checkout|extra ip|backup/, "OS and location are chosen on the configure screen when you add a plan. Extra IP and backup products are not priced here."],
      [/cancel an order|didn.t pay|unpaid|without paying|change my order/, "An unpaid configure cart is not an order. I cannot cancel or edit a billed order from chat."],
      [/whatsapp|place the order for me|quotation|proforma/, "I cannot place an order for you or issue a proforma invoice."],
      [/specific ip|clean ip|using a vpn|from my country|maximum number|for a client|multiple servers/, "I cannot reserve an IP, bypass a country rule, or cap an order count. Nothing here is charged."],
      [/checkout page is not loading/, "I cannot see your browser session. Refresh Pricing and try the configure cart again."],
    ],
    "Ordering here means the configure cart. It is not a completed purchase.",
  );
  return say(lead, DEMO, CONTACT);
}

export function salesCategory(category: string, matching: string): string | null {
  const c = category.toLowerCase();
  if (c.startsWith("general")) return general(matching);
  if (c.startsWith("choosing")) return choosing(matching);
  if (c.startsWith("locations")) return locations(matching);
  if (c.startsWith("pricing")) return pricing(matching);
  if (c.startsWith("payment")) return payment(matching);
  if (c.startsWith("ordering")) return ordering(matching);
  return null;
}
