import type { BlogArticle } from "@/features/blog/model/types";
import { BLOG_AUTHOR } from "./author";

export const SECURITY_POSTS: readonly BlogArticle[] = [
  {
    id: "post-02",
    slug: "ssh-hardening-checklist-for-new-servers",
    title: "SSH hardening checklist for new servers",
    excerpt:
      "Eight habits that close the easy doors attackers try first on a fresh Linux box.",
    categoryId: "cat-security",
    tags: ["ssh", "hardening"],
    coverImageUrl: "/images/showcase/rail-photo-cloud.jpg",
    coverImageAlt: "Cloud infrastructure abstract",
    featured: false,
    status: "published",
    publishedAt: "2026-03-05T09:00:00.000Z",
    ...BLOG_AUTHOR,
    content: [
      {
        type: "p",
        text: "A new server is loud on the internet. Bots probe SSH within minutes. Closing default doors early costs little and prevents noisy incidents later.",
      },
      {
        type: "h2",
        id: "keys-not-passwords",
        text: "Prefer keys over passwords",
      },
      {
        type: "p",
        text: "Disable password authentication once your key works. Keep a recovery path documented offline—never rely on a single laptop key with no backup.",
      },
      {
        type: "h2",
        id: "limit-who-can-log-in",
        text: "Limit who can log in",
      },
      {
        type: "ul",
        items: [
          "Disable root SSH login; use a named admin user with sudo.",
          "Allow only required users in AllowUsers or an equivalent group.",
          "Consider changing the default port only as defense-in-depth—not as a substitute for keys.",
        ],
      },
      {
        type: "h2",
        id: "firewall-and-fail2ban",
        text: "Firewall and rate limits",
      },
      {
        type: "p",
        text: "Allow SSH only from known networks when possible. Pair that with fail2ban or equivalent rate limiting so repeated failures earn a temporary ban.",
      },
      {
        type: "h2",
        id: "keep-ssh-updated",
        text: "Keep SSH updated",
      },
      {
        type: "p",
        text: "Patch the OpenSSH package with the rest of the system. Review auth logs weekly until the noise floor is familiar—then anomalies stand out.",
      },
    ],
  },
  {
    id: "post-08",
    slug: "tls-certificates-without-drama",
    title: "TLS certificates without drama",
    excerpt:
      "Renewals, redirects, and the few checks that prevent Monday-morning HTTPS outages.",
    categoryId: "cat-security",
    tags: ["tls", "https"],
    coverImageUrl: "/images/showcase/rail-preview-brand.jpg",
    coverImageAlt: "Brand and identity workspace",
    featured: false,
    status: "published",
    publishedAt: "2026-01-22T15:00:00.000Z",
    ...BLOG_AUTHOR,
    content: [
      {
        type: "p",
        text: "Expired certificates are a classic self-inflicted outage. Automation helps, but only if you still verify what clients see.",
      },
      {
        type: "h2",
        id: "automate-renewal",
        text: "Automate renewal",
      },
      {
        type: "p",
        text: "Use ACME clients or your panel’s renewal path. Confirm the renewal job runs and reloads the web server—silent success that never reloads still serves the old cert.",
      },
      {
        type: "h2",
        id: "watch-the-chain",
        text: "Watch the chain and redirects",
      },
      {
        type: "ul",
        items: [
          "Serve the full chain clients expect.",
          "Redirect HTTP to HTTPS once, cleanly.",
          "Alert 14 days before expiry as a safety net for automation failure.",
        ],
      },
      {
        type: "h2",
        id: "staging-checks",
        text: "Staging checks",
      },
      {
        type: "p",
        text: "After any DNS or proxy change, open the site in a private window and inspect the certificate hostname. Catch mismatches before customers do.",
      },
    ],
  },
  {
    id: "post-11",
    slug: "locking-down-windows-firewall-for-rdp",
    title: "Locking down Windows Firewall for RDP",
    excerpt:
      "Reduce exposure without locking yourself out—scoped rules and a recovery plan.",
    categoryId: "cat-security",
    tags: ["firewall", "windows"],
    coverImageUrl: "/images/showcase/rail-photo-operator.jpg",
    coverImageAlt: "Operator at a workstation",
    featured: false,
    status: "published",
    publishedAt: "2025-12-20T11:00:00.000Z",
    ...BLOG_AUTHOR,
    content: [
      {
        type: "p",
        text: "Leaving RDP open to the world invites constant probes. Scoping who can connect is one of the highest-leverage Windows hardening steps.",
      },
      {
        type: "h2",
        id: "scope-by-source",
        text: "Scope by source address",
      },
      {
        type: "p",
        text: "Prefer allowlists for office, VPN, or bastion IPs. If your ISP changes addresses often, use a VPN hop instead of opening the port widely.",
      },
      {
        type: "h2",
        id: "do-not-lock-yourself-out",
        text: "Do not lock yourself out",
      },
      {
        type: "ul",
        items: [
          "Keep a console or provider recovery path before tightening rules.",
          "Test a second session before closing the first.",
          "Document the exact rule set after it works.",
        ],
      },
      {
        type: "h2",
        id: "pair-with-account-hygiene",
        text: "Pair with account hygiene",
      },
      {
        type: "p",
        text: "Firewall rules complement—not replace—strong passwords, MFA where available, and disabling unused local accounts.",
      },
    ],
  },
];
