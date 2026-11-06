/**
 * Operational, networking, migration, and workload knowledge clusters.
 */
import type { CuratedBlock } from "./phraseCuratedCore.js";

export const CURATED_OPS: CuratedBlock[] = [
  {
    id: "ops_migration",
    phrases: [
      "how do i migrate my website to runracks",
      "server migration guide",
      "can i move my server from another host",
      "how to transfer cpanel backup",
      "moving my site to vps",
      "website migration assistance",
    ],
    answer:
      "Migrating to RunRacks is straightforward:\n1. Deploy your RunRacks VPS and configure your preferred web stack or panel.\n2. Generate a full backup from your previous provider (e.g. cPanel backup, WordPress export, or database dump).\n3. Transfer the backup to your RunRacks server using `rsync`, `scp`, or SFTP.\n4. Restore files, import databases, test via temporary hosts file, and update your domain’s DNS records.",
  },
  {
    id: "ops_bandwidth",
    phrases: [
      "how much bandwidth do i get",
      "what is 30 tb traffic",
      "what is your port speed",
      "what happens if i exceed 30 tb",
      "bandwidth limits",
      "is bandwidth high speed",
      "traffic allowance",
    ],
    answer:
      "All RunRacks plans include a generous 30 TB high-speed monthly data transfer allowance delivered over redundant 1 Gbps uplinks. 30 TB is more than enough for high-traffic websites, media streaming, and APIs. If you anticipate exceeding 30 TB, bandwidth packages can be expanded.",
  },
  {
    id: "ops_provisioning",
    phrases: [
      "how long does setup take",
      "when will my server be ready",
      "instant provisioning time",
      "how fast is deployment",
      "delivery time for vps",
    ],
    answer:
      "RunRacks utilizes fully automated provisioning. Once your order and billing are confirmed, your VPS or Admin RDP instance is automatically deployed, imaged, and connected to the network in approximately 15 minutes. IP and root/admin credentials are emailed to you immediately.",
  },
  {
    id: "ops_ddos",
    phrases: [
      "do you provide ddos protection",
      "how does anti ddos work",
      "ddos mitigation capacity",
      "is ddos protection free",
      "volumetric attack mitigation",
      "protect against ddos",
    ],
    answer:
      "Yes! Enterprise Anti-DDoS mitigation is included standard on all RunRacks servers at no extra charge. Our network uplinks actively inspect traffic in real time, automatically absorbing and filtering volumetric Layer 3/4 attacks (SYN floods, UDP amplification, ICMP floods) before they reach your virtual server.",
  },
  {
    id: "ops_ip",
    phrases: [
      "do i get a dedicated ip address",
      "is dedicated ipv4 included",
      "can i get extra ip addresses",
      "do you support ipv6",
      "ip allocation details",
    ],
    answer:
      "Yes, every RunRacks VPS and Admin RDP plan includes a dedicated, clean IPv4 address with reverse DNS (PTR) capability. Additional IPv4 addresses can be requested, and dual-stack IPv6 networking is available across all datacenter locations.",
  },
  {
    id: "ops_upgrades",
    phrases: [
      "can i upgrade my vps plan later",
      "how to scale cpu and ram",
      "can i add more storage",
      "resource upgrades without data loss",
      "scaling my server tier",
    ],
    answer:
      "Yes! You can scale your VPS resources (CPU cores, RAM, NVMe storage, and bandwidth) as your project grows. Upgrades are seamless: your data, IP address, and system configurations are completely preserved during the transition.",
  },
  {
    id: "ops_payment",
    phrases: [
      "what payment methods do you accept",
      "can i pay with credit card",
      "do you accept paypal",
      "can i pay with crypto",
      "billing cycles available",
      "payment options",
    ],
    answer:
      "I cannot confirm card, PayPal, bank transfer, JazzCash, Easypaisa, or crypto as accepted methods. The checkout screen shows card (Visa, Mastercard, American Express), PayPal, and bank transfer as layout only. Live payment is not connected, no card data is stored, and I will not give a wallet account number or a PKR rate. Demo terms are 1, 3, 6, and 12 months with no extra annual discount published.",
  },
  {
    id: "ops_dns",
    phrases: [
      "how to point domain to my vps",
      "how to setup dns records",
      "what nameservers do i use",
      "pointing an a record to vps",
      "using cloudflare with runracks",
    ],
    answer:
      "To point your domain to your RunRacks server:\n1. Log in to your domain registrar (or Cloudflare).\n2. Create an `A` record pointing `@` (root) to your server’s dedicated IPv4 address.\n3. Create a `CNAME` or `A` record for `www` pointing to your server.\nDNS propagation typically finishes within a few minutes to a few hours.",
  },
  {
    id: "ops_ssl",
    phrases: [
      "do you offer free ssl certificates",
      "how to install let's encrypt ssl",
      "how to enable https on vps",
      "certbot ssl installation",
      "ssl setup guide",
    ],
    answer:
      "Yes! With full root access, you can install free, auto-renewing SSL/TLS certificates via Let’s Encrypt and Certbot for Nginx or Apache, or enable 1-click SSL through control panels like CyberPanel, cPanel, or CloudPanel.",
  },
  {
    id: "ops_wordpress",
    phrases: [
      "can i host wordpress on runracks",
      "best plan for wordpress website",
      "wordpress performance on vps",
      "woocommerce hosting on vps",
      "can i run multiple wordpress sites",
    ],
    answer:
      "RunRacks Linux VPS is ideal for WordPress and WooCommerce. With dedicated CPU cores, NVMe SSDs in RAID-10, and 30 TB traffic, WordPress sites load significantly faster than on shared hosting. For a starter site or blog, VPS 1 ($4.49/mo) or VPS 2 ($10.49/mo) is excellent; for busy WooCommerce stores or multiple client sites, VPS 3 ($18.89/mo) provides high headroom.",
  },
  {
    id: "ops_forex",
    phrases: [
      "can i use windows vps for forex trading",
      "metatrader 4 5 on vps",
      "forex vps with low latency",
      "trading bots on windows vps",
      "24 7 automated trading vps",
    ],
    answer:
      "Yes! RunRacks Windows VPS and Admin RDP plans are widely used for 24/7 automated Forex trading and financial bots. You can run MetaTrader 4 (MT4), MetaTrader 5 (MT5), cTrader, and custom EA algorithms continuously with low network latency to major financial exchanges and brokers.",
  },
];

