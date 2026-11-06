/**
 * Security, policy, and comparison categories from the training sheet.
 */
import {
  BACKUP,
  CHEAP,
  CONTACT,
  DDOS,
  DEMO,
  NO_LEGAL,
  NOT_SOLD,
  REGIONS,
  firstMatch,
  say,
} from "./trainingFacts.js";

function security(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/ddos|null-rout|null route/, DDOS],
      [/firewall|ufw|firewalld|fail2ban|brute-force|default ports|root login|automatic security|2fa|two-factor|who is logged|failed login/, "Those are tools you configure on the server. I will not claim they are preinstalled."],
      [/hacked|spam|attack without|abuse|ransomware|malware|scan/, `I cannot clean a server from chat. ${CONTACT}`],
      [/encrypted|ssl|let.s encrypt|certificate/, "I will not claim disks are encrypted. On a root server you can install a certificate yourself."],
      [/antivirus|staff see|access to my server data|gdpr|isolated|data center/, "I will not claim a GDPR audit, staff-access rules, or physical security details."],
      [/secure my server|hardening/, "Managed hardening is not a priced product."],
      [/cloudflare|vpn to connect/, "You can put your own proxy in front of a server you control. That is not a RunRacks product."],
    ],
    DDOS,
  );
  return say(lead, CONTACT);
}

function panels(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/cpanel|plesk|directadmin|softaculous|cloudlinux|imunify|litespeed|webuzo|license/, "No panel license or license price is in this catalog."],
      [/cyberpanel|aapanel|free control panel|which free/, "Free panels are not bundled. Installing one is your own license and support."],
      [/wordpress|magento|woocommerce|moodle|nextcloud|n8n|coolify|dokploy|jenkins|gitlab|odoo|ollama|stable diffusion|pterodactyl|teamspeak|plex|jellyfin|asterisk|zimbra|mailcow|node-red|home assistant|java|php 8|docker|any software|one-click|whmcs/, "Root or administrator access lets you install software you are allowed to use. I will not promise a one-click installer or GPU for an AI model."],
    ],
    "A control panel is not included.",
  );
  return say(lead, NOT_SOLD, CONTACT);
}

function domains(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/sell domains|free domain|\.pk\b|transfer my domain|domain privacy|renew my domain/, "Domain registration, transfer, and privacy are not RunRacks products."],
      [/point my domain|nameserver|dns management|a record|cloudflare|propagation|not pointing|namecheap|godaddy|subdomain|multiple domains/, "DNS stays at your registrar or DNS host. I will not invent RunRacks nameservers. An A record points at your server IP once you have one."],
      [/email hosting|email accounts|mail server|spam|spf|dkim|dmarc|bulk email|email marketing|emails per hour|gmail|zoho|smtp|sendgrid|mailgun|webmail|can.t i send|can.t i receive|reverse dns for my mail/, "Email hosting is not a catalog product. I will not bless bulk mail or promise inbox placement."],
      [/ssl/, "A domain SSL product is not included. On a root server you can install a certificate yourself."],
    ],
    "Domains, DNS hosting, and email hosting are not in this catalog.",
  );
  return say(lead, CONTACT);
}

function allowed(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/mining|torrent|iptv|spam|phishing|port scanning|penetration|tor relay|dmca|copyright|adult|gambling|click bot|traffic bot|ad fraud/, "I will not say that activity is allowed."],
      [/vpn|proxy|game server|streaming|forex|trading bot|scraping|seo software|resell|clients|hosting company|social media|discord|minecraft|forum|crypto node|ai training|countries|high resource/, "The written acceptable-use policy is not published, so I will not approve or ban that workload by name beyond unlawful use."],
      [/what is allowed|what is not allowed|acceptable use|break the rules|warning|abuse suspension|without notice|law enforcement|dmca/, "I do not have the written policy, a warning period, or a law-enforcement procedure."],
    ],
    "Do not use the service for unlawful activity. The acceptable-use page is not published.",
  );
  return say(lead, NO_LEGAL, CONTACT);
}

function support(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/24\/7|24 7|how fast|reply|weekend|eid|holiday|whatsapp|phone|urdu|live chat|callback|anydesk|teamviewer|discord|telegram/, "I will not promise hours, a language, a phone line, or a remote-desktop support session."],
      [/open a support ticket|ticket|escalat|unanswered|close a ticket|reopen|feedback|complaint/, "I cannot open, escalate, or close a ticket from this chat."],
      [/what does support cover|install software|website code|configure my server|managed|how much does managed/, "Managed support has no published price. This chat cannot change your server."],
      [/password in the ticket|share my server password/, "Do not send a password in chat or in a ticket draft here."],
      [/billing questions|sales questions|abuse/, CONTACT],
      [/knowledge base|this ai|human/, "This chat is the automated advisor. A human reply is the Contact page, and I will not promise a time."],
    ],
    CONTACT,
  );
  return say(lead, CONTACT);
}

function trouble(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/down|not responding|won.t start|stuck on boot|reboot/, "I cannot reboot the server or see if it is down."],
      [/website|500|502|503|504|database connection|not secure|ssl|works on ip but not/, "A site error has to be checked on the server. I cannot see the vhost or the certificate."],
      [/disk is full|out of memory|mysql|apache|nginx|time is wrong|dns is not|apt or yum|permission denied|deleted important|broke my|cron|docker containers/, "That is an on-server fault. I cannot log in and fix it."],
      [/windows vps|mt4|mt5|chrome|download files|keyboard|resolution|copy-paste|100% cpu|license will expire/, "I cannot see the Windows session. License expiry text is not something I can clear from here."],
      [/suspended/, "I cannot see a suspension reason."],
      [/pakistan|ptcl|nayatel|jazz|ping|upload speed|ip is not working/, "I will not invent an ISP or ping fault. I cannot see the path from Pakistan."],
      [/authentication failures|vnc console|client area shows/, "I cannot see the console or the client area. Account tools are not connected."],
      [/unknown processes/, "Unknown processes can mean a compromise. Do not paste passwords. Use Contact."],
      [/email is bouncing/, "Mail deliverability is not a RunRacks product I can repair from chat."],
    ],
    "I cannot see the server. Linux is SSH, Windows is Remote Desktop, and I will not ask for the password.",
  );
  return say(lead, CONTACT);
}

function policies(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/terms of service|privacy policy|refund policy|sla|personal data|third parties|sell my data|how long do you keep|deletion|server logs|gdpr|kyc|id document|id kept|dmca|which country|court order|authorities|anonymous|warrant|nda|dpa|contract|letter of authorization|account sharing|chargeback|fraud|liability|changes its terms|policy changes/, NO_LEGAL],
    ],
    NO_LEGAL,
  );
  return say(lead, "I will not invent a retention period, a liability cap, or which country's law applies.", CONTACT);
}

function affiliate(): string {
  return say(
    "No affiliate or reseller program, commission rate, cookie, payout, banner pack, or WHMCS reseller module is published. I will not invent a percentage or a JazzCash payout.",
    CONTACT,
  );
}

function romanFallback(): string {
  return say(
    "RunRacks catalog mein Linux VPS, Windows VPS, aur Admin RDP hain.",
    "Sab se sasta Linux demo VPS 1 $4.49/mo hai. Yeh order nahi.",
    "JazzCash, Easypaisa, SLA, ping number, aur affiliate commission confirm nahi.",
    CONTACT,
  );
}

function comparisons(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/better than|hostinger|contabo|vultr|linode|lightsail|pakistani hosting|fiverr|free cloud/, "I will not say RunRacks is better, and I will not invent the other side's price or SLA."],
      [/cheaper than|at this price|oversold|dedicated resources/, "I will not claim the price proves dedicated hardware or that capacity is never oversold."],
      [/trust a newer|shuts down|proof of your uptime|existing customer/, "I have no founding year, uptime proof, or customer introduction to offer."],
      [/human or only ai|support actually/, "This chat is the automated advisor. Human contact is the Contact page. I will not promise a reply time."],
      [/instead of shared|worth it for a small/, "A VPS card is root or administrator access, unlike shared hosting. Shared hosting is not sold here."],
      [/mt4|linux work/, "MetaTrader is a Windows app. I will not say Linux runs it."],
      [/not satisfied|long-term contract|lock-in/, `${NO_LEGAL} Demo terms are 1, 3, 6, or 12 months. I will not invent a lock-in beyond the term you select.`],
    ],
    "I compare RunRacks cards with each other. I do not invent another company's price.",
  );
  return say(lead, CHEAP, `Regions: ${REGIONS}.`, DEMO);
}

export function trustCategory(category: string, matching: string): string | null {
  const c = category.toLowerCase();
  if (c.startsWith("security")) return security(matching);
  if (c.startsWith("backups")) return say(BACKUP, CONTACT);
  if (c.startsWith("control")) return panels(matching);
  if (c.startsWith("domains")) return domains(matching);
  if (c.startsWith("allowed")) return allowed(matching);
  if (c.startsWith("support")) return support(matching);
  if (c.startsWith("troubleshooting")) return trouble(matching);
  if (c.startsWith("policies")) return policies(matching);
  if (c.startsWith("affiliate")) return affiliate();
  if (c.startsWith("roman")) return romanFallback();
  if (c.startsWith("comparisons")) return comparisons(matching);
  return null;
}
