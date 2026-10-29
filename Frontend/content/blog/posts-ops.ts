import type { BlogArticle } from "@/features/blog/model/types";
import { BLOG_AUTHOR } from "./author";

export const OPS_POSTS: readonly BlogArticle[] = [
  {
    id: "post-04",
    slug: "backup-strategy-that-survives-mistakes",
    title: "A backup strategy that survives mistakes",
    excerpt:
      "Backups only matter if restores work. Design for human error, not just disk failure.",
    categoryId: "cat-ops",
    tags: ["backups", "ops"],
    coverImageUrl: "/images/showcase/plans-cover-1200.jpg",
    coverImageAlt: "Planning documents and workspace",
    featured: false,
    status: "published",
    publishedAt: "2026-02-20T08:30:00.000Z",
    ...BLOG_AUTHOR,
    content: [
      {
        type: "p",
        text: "Disk failure is rare compared with accidental deletes, bad deploys, and ransomware. Your backup plan should assume someone will make a costly mistake—and that you will need yesterday’s state quickly.",
      },
      {
        type: "h2",
        id: "define-rpo-rto",
        text: "Define RPO and RTO in plain language",
      },
      {
        type: "p",
        text: "Recovery point objective is how much data you can afford to lose. Recovery time objective is how long you can stay down. Write both as numbers the business agrees on, then pick tooling that can meet them.",
      },
      {
        type: "h2",
        id: "three-copies",
        text: "Keep three copies, two media, one offsite",
      },
      {
        type: "p",
        text: "Local snapshots are fast. Offsite copies survive site-level incidents. Test that you can restore a full environment—not just that a job completed with a green checkmark.",
      },
      {
        type: "h2",
        id: "schedule-restore-drills",
        text: "Schedule restore drills",
      },
      {
        type: "ul",
        items: [
          "Quarterly: restore a database to a throwaway host.",
          "After major schema changes: confirm backups still include what you need.",
          "Document who owns the drill and where restore runbooks live.",
        ],
      },
    ],
  },
  {
    id: "post-06",
    slug: "monitoring-basics-for-small-teams",
    title: "Monitoring basics for small teams",
    excerpt:
      "A minimal alert set that catches real outages without waking you for noise.",
    categoryId: "cat-ops",
    tags: ["monitoring", "alerts"],
    coverImageUrl: "/images/showcase/rail-preview-grow.jpg",
    coverImageAlt: "Growth and metrics visualization",
    featured: false,
    status: "published",
    publishedAt: "2026-02-08T12:00:00.000Z",
    ...BLOG_AUTHOR,
    content: [
      {
        type: "p",
        text: "Small teams cannot staff a NOC. Start with a few signals that map to user pain, then add depth only when those alerts prove useful.",
      },
      {
        type: "h2",
        id: "uptime-from-outside",
        text: "Uptime from outside the server",
      },
      {
        type: "p",
        text: "Probe HTTPS from a second network. Internal checks miss DNS, certificate, and routing failures that users hit first.",
      },
      {
        type: "h2",
        id: "host-health",
        text: "Host health",
      },
      {
        type: "ul",
        items: [
          "Disk space with enough lead time to act before 100%.",
          "Memory pressure and swap thrash.",
          "CPU saturation sustained over minutes—not single spikes.",
        ],
      },
      {
        type: "h2",
        id: "alert-hygiene",
        text: "Alert hygiene",
      },
      {
        type: "p",
        text: "Every alert needs an owner and a next step. If nobody knows what to do when it fires, delete or rewrite it. Quiet nights beat clever dashboards.",
      },
    ],
  },
  {
    id: "post-10",
    slug: "incident-notes-that-future-you-will-thank",
    title: "Incident notes that future you will thank",
    excerpt:
      "A lightweight template so the next outage starts with facts, not archaeology.",
    categoryId: "cat-ops",
    tags: ["incidents", "docs"],
    coverImageUrl: "/images/showcase/rail-preview-leads.jpg",
    coverImageAlt: "Team coordination workspace",
    featured: false,
    status: "published",
    publishedAt: "2026-01-08T13:00:00.000Z",
    ...BLOG_AUTHOR,
    content: [
      {
        type: "p",
        text: "Memory fades fast after an outage. Five minutes of notes while the timeline is fresh saves hours next time.",
      },
      {
        type: "h2",
        id: "capture-the-timeline",
        text: "Capture the timeline",
      },
      {
        type: "p",
        text: "Record detection time, customer impact, first mitigation, and full recovery. Use UTC. Link to dashboards and tickets—do not paste secrets.",
      },
      {
        type: "h2",
        id: "what-changed",
        text: "What changed",
      },
      {
        type: "ul",
        items: [
          "Deploys, config edits, DNS, or vendor incidents in the window.",
          "Whether rollback or forward-fix restored service.",
          "Open follow-ups with owners and due dates.",
        ],
      },
      {
        type: "h2",
        id: "keep-it-short",
        text: "Keep it short",
      },
      {
        type: "p",
        text: "One page beats a novel nobody reads. Store notes where the team already looks during incidents.",
      },
    ],
  },
];
