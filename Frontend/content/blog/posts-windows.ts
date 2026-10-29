import type { BlogArticle } from "@/features/blog/model/types";
import { BLOG_AUTHOR } from "./author";

export const WINDOWS_POSTS: readonly BlogArticle[] = [
  {
    id: "post-03",
    slug: "windows-rdp-session-best-practices",
    title: "Windows RDP session best practices",
    excerpt:
      "Keep remote desktops responsive and safer with session hygiene your team will actually follow.",
    categoryId: "cat-windows",
    tags: ["rdp", "windows"],
    coverImageUrl: "/images/showcase/windows-cover-1200.jpg",
    coverImageAlt: "Windows desktop environment",
    featured: false,
    status: "published",
    publishedAt: "2026-02-28T11:00:00.000Z",
    ...BLOG_AUTHOR,
    content: [
      {
        type: "p",
        text: "Remote Desktop is convenient—and easy to leave messy. Small session habits keep latency down and reduce the chance of locked files or abandoned processes.",
      },
      {
        type: "h2",
        id: "sign-out-cleanly",
        text: "Sign out cleanly",
      },
      {
        type: "p",
        text: "Disconnecting is fine for short breaks. Signing out releases licenses and stops background apps from holding RAM overnight. Agree as a team which apps must stay running and which should not.",
      },
      {
        type: "h2",
        id: "display-and-bandwidth",
        text: "Display and bandwidth",
      },
      {
        type: "ul",
        items: [
          "Match color depth and resolution to the task—design work needs more; admin shells need less.",
          "Disable unused redirection (printers, drives) when you do not need them.",
          "Use a wired or stable Wi-Fi path for long interactive sessions.",
        ],
      },
      {
        type: "h2",
        id: "accounts-and-nla",
        text: "Accounts and NLA",
      },
      {
        type: "p",
        text: "Require Network Level Authentication. Use unique accounts per person—shared passwords make audits impossible and rotations painful.",
      },
    ],
  },
  {
    id: "post-07",
    slug: "admin-rdp-for-distributed-teams",
    title: "Admin RDP for distributed teams",
    excerpt:
      "How shared Windows environments stay usable when people work across time zones.",
    categoryId: "cat-windows",
    tags: ["admin-rdp", "teams"],
    coverImageUrl: "/images/showcase/admin-rdp-cover-1200.jpg",
    coverImageAlt: "Remote desktop collaboration setup",
    featured: false,
    status: "published",
    publishedAt: "2026-01-30T09:00:00.000Z",
    ...BLOG_AUTHOR,
    content: [
      {
        type: "p",
        text: "Distributed teams share tools, browsers, and desktop apps on a common Windows host. The win is consistency; the risk is contention and unclear ownership.",
      },
      {
        type: "h2",
        id: "named-accounts",
        text: "Named accounts and roles",
      },
      {
        type: "p",
        text: "Give each person an account. Separate admin rights from day-to-day work so accidental changes stay limited. Rotate credentials when someone leaves—do not share a single login forever.",
      },
      {
        type: "h2",
        id: "session-capacity",
        text: "Session capacity",
      },
      {
        type: "p",
        text: "Know how many concurrent sessions your plan supports. Stagger heavy browser or rendering work when possible. Schedule maintenance windows in a channel everyone watches.",
      },
      {
        type: "h2",
        id: "data-hygiene",
        text: "Data hygiene",
      },
      {
        type: "ul",
        items: [
          "Agree where project files live—and what never belongs on a shared desktop.",
          "Clear downloads folders on a cadence.",
          "Keep personal MFA and password managers off shared profiles when policy allows.",
        ],
      },
    ],
  },
  {
    id: "post-12",
    slug: "windows-updates-on-production-hosts",
    title: "Windows updates on production hosts",
    excerpt:
      "Patch without surprise reboots: maintenance windows, staging, and rollback habits.",
    categoryId: "cat-windows",
    tags: ["updates", "windows"],
    coverImageUrl: "/images/showcase/vps-photo-right.jpg",
    coverImageAlt: "Server room perspective",
    featured: false,
    status: "published",
    publishedAt: "2025-12-12T09:30:00.000Z",
    ...BLOG_AUTHOR,
    content: [
      {
        type: "p",
        text: "Unplanned reboots during peak hours destroy trust. Treat Windows updates like any other production change: scheduled, tested, and reversible when possible.",
      },
      {
        type: "h2",
        id: "stage-first",
        text: "Stage first",
      },
      {
        type: "p",
        text: "Apply the same update package to a non-production twin. Confirm critical apps still start after reboot before touching production.",
      },
      {
        type: "h2",
        id: "maintenance-windows",
        text: "Maintenance windows",
      },
      {
        type: "ul",
        items: [
          "Announce the window to users who depend on the host.",
          "Disable automatic reboot during business hours if policy allows controlled deferral.",
          "Verify services after restart—do not assume green means ready.",
        ],
      },
      {
        type: "h2",
        id: "record-what-shipped",
        text: "Record what shipped",
      },
      {
        type: "p",
        text: "Note KB numbers and reboot times in your ops log. When something regresses a week later, you will know where to look first.",
      },
    ],
  },
];
