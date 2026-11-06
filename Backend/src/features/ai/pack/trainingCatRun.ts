/**
 * Account, billing, network, and capacity categories.
 */
import {
  ACCOUNT,
  BILL,
  CHEAP,
  CONTACT,
  DEMO,
  NO_LEGAL,
  firstMatch,
  say,
} from "./trainingFacts.js";

function account(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/create|log in|sign in|google|password|2fa|two-factor|security question|locked|verify|login history|someone logged/, ACCOUNT],
      [/email address|name or address|phone|sub-user|developer access|two accounts|merge|transfer a service|delete my account|account owner|currency|urdu|dark mode/, "Those account settings are not available. Registration is not connected."],
      [/my services|server details|server ip|welcome email|resend/, "I cannot see your services or resend server details. Do not paste a password."],
      [/invoices|pdf|tickets|notification/, "Invoices and tickets are not available in this chat."],
      [/suspended|closed/, "I cannot see why an account was suspended or closed."],
      [/reboot|start, stop|start stop/, "I cannot reboot, start, or stop a server from chat."],
      [/data safe/, `I will not claim a storage-security audit. ${NO_LEGAL}`],
    ],
    ACCOUNT,
  );
  return say(lead, CONTACT);
}

function invoices(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/when will i be billed|how does billing|generated|days before|pay an invoice|partially|pay late|late fee|grace|suspended for non-payment|terminated|recover|extension|didn.t expect|amount different|billing cycle|monthly to annual|combine|company name|vat|ntn|tax invoice|old invoice|credit balance|withdraw|prorate|cancel mid|charged again|billing history|reminder|invoice email|different currency|due date|cancelled|statement|net-30|2 years|next payment|auto-payment/, "Billing is not connected, so I cannot see or change any of that."],
    ],
    "I cannot see invoices or billing dates.",
  );
  return say(lead, BILL, DEMO, NO_LEGAL, CONTACT);
}

function renewals(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/renew|auto-renew|reminder|expired|suspended service|longer period/, "I cannot renew a service or see an expiry date from chat."],
      [/cancel|pause|undo|confirmation|add-on|automatically/, "I cannot cancel, pause, or undo a cancellation from chat."],
      [/refund|money-back|money back|jazzcash|paypal|chargeback|not happy|downtime|unused/, NO_LEGAL],
      [/data after|how long after expiry|deleted|restore/, "I cannot promise how long data is kept or that a deleted server can be restored."],
      [/ip stay/, "I will not promise the IP stays the same after renewal."],
    ],
    NO_LEGAL,
  );
  return say(lead, "I will not start a refund or a cancellation from chat.", CONTACT);
}

function network(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/how many ip|dedicated|shared with other|clean|blacklisted|change my ip|fee to change|different subnet|additional ip|nat vps|configure an additional/, "Linux cards include one dedicated IPv4. Extra IPs, IP changes, and a clean-IP promise are not published."],
      [/ipv6/, "An IPv6 count is not published."],
      [/byoip|bring my own ip|floating|bgp/, "Bring-your-own-IP, floating IPs, and BGP are not confirmed."],
      [/rdns|reverse dns|ptr/, "Reverse DNS is not confirmed as a self-serve switch."],
      [/port speed|1 gbps|10 gbps/, "Linux cards label a 1 Gbps port. I will not claim 10 Gbps."],
      [/how much bandwidth|30 tb|unmetered|unlimited|exceed|fair usage|incoming|usage|suspended if i use/, "Linux cards label 30 TB monthly traffic. I will not call it unmetered or quote an overage price."],
      [/port 25|ports blocked|custom ports/, "I will not say port 25 is open or list blocked ports."],
      [/private network|two of my vps/, "Private networking between servers is not confirmed."],
      [/slow|speed test|ping high|packet loss|carriers/, "I cannot see your path, and I will not invent a speed or packet-loss figure."],
      [/proxy|google|captcha|netflix|streaming/, "I will not promise an IP will work with Google, Netflix, or a proxy."],
    ],
    "Linux cards list one dedicated IPv4, 30 TB, and a 1 Gbps port label.",
  );
  return say(lead, DEMO, CONTACT);
}

function performance(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/ram dedicated|oversell|fair usage|100% cpu|steal time|throttle|other customers/, "I will not claim CPU or RAM is dedicated, or that servers are never oversold."],
      [/slow|cpu usage|ram usage|disk full|loading slowly|optimize|why is my/, "I cannot see the live process list. Compare the card's vCPU, RAM, and NVMe."],
      [/check resource|monitoring|alerts|graphs/, "A monitoring graph in the client area is not available from this chat."],
      [/read\/write|iops|raid|nvme or sata|nvme|sata/, "Cards list NVMe. I will not claim RAID or a measured IOPS number."],
      [/maximum disk|second disk|inode|processes|connections/, "The largest NVMe sizes are the ones printed on the cards. Inode and process caps are not published."],
      [/how many websites|visitors|mt4|chrome tabs/, "I will not turn the card into a visitor, terminal, or tab count."],
      [/high-frequency|dedicated cpu|benchmark|compare to other/, "No high-frequency CPU model is named. I will not rank speed against another provider."],
    ],
    "Use the vCPU, RAM, and NVMe printed on the card.",
  );
  return say(lead, CHEAP, CONTACT);
}

function upgrades(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/without losing data|restart|how long|ip change|price calculated|fee|middle of|temporarily|paid for an upgrade|automatically after payment|nothing changed/, "I cannot run an upgrade or promise that data, IP, or downtime will behave a certain way."],
      [/only ram|only storage|only cpu|only disk|bandwidth|port speed|more ips|location as part/, "RAM, disk, CPU, bandwidth, and port speed are not sold by themselves. Pick another published card."],
      [/downgrade/, "I cannot downgrade a plan from chat or promise a smaller disk keeps all files."],
      [/rdp to vps|linux vps to windows|dedicated server/, "Moving between families means choosing that family's card. Dedicated servers are not in the catalog."],
      [/partition|extend the disk/, "I cannot resize a partition from chat."],
      [/upgrade option|for me|highest plan/, "The largest cards are VPS 6, Windows VPS 11, and Admin RDP 11. I cannot click upgrade for you."],
    ],
    "Compare a larger published card. This chat cannot apply an upgrade.",
  );
  return say(lead, CHEAP, DEMO, CONTACT);
}

export function runCategory(category: string, matching: string): string | null {
  const c = category.toLowerCase();
  if (c.startsWith("account")) return account(matching);
  if (c.startsWith("invoices")) return invoices(matching);
  if (c.startsWith("renewals")) return renewals(matching);
  if (c.startsWith("network")) return network(matching);
  if (c.startsWith("performance")) return performance(matching);
  if (c.startsWith("upgrades")) return upgrades(matching);
  return null;
}
