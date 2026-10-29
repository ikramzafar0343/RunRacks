import type { BlogArticle } from "@/features/blog/model/types";
import { BLOG_AUTHOR } from "./author";

export const VPS_POSTS: readonly BlogArticle[] = [
  {
    id: "post-01",
    slug: "choosing-vps-resources-for-production",
    title: "Choosing VPS resources for production workloads",
    excerpt:
      "A practical way to size CPU, RAM, and disk before you launch—not after traffic spikes.",
    categoryId: "cat-vps",
    tags: ["vps", "capacity"],
    coverImageUrl: "/images/showcase/vps-cover-1200.jpg",
    coverImageAlt: "Server rack aisle with cool lighting",
    coverImageCaption:
      "Capacity planning starts with the workload shape, not the largest plan.",
    featured: true,
    status: "published",
    publishedAt: "2026-03-12T10:00:00.000Z",
    updatedAt: "2026-03-18T14:00:00.000Z",
    seoTitle: "Choosing VPS Resources for Production | RunRacks",
    seoDescription:
      "How to size CPU, memory, and storage for production VPS workloads without overbuying.",
    ...BLOG_AUTHOR,
    content: [
      {
        type: "p",
        text: "Sizing a VPS is less about chasing the biggest SKU and more about matching the shape of your workload. CPU-bound APIs, memory-heavy caches, and write-heavy databases each fail in different ways when undersized.",
      },
      {
        type: "h2",
        id: "start-with-the-workload",
        text: "Start with the workload, not the menu",
      },
      {
        type: "p",
        text: "List the processes that must stay healthy under peak load: application servers, databases, queues, and background jobs. Note whether they scale with concurrency, dataset size, or disk I/O. That short list drives every resource decision that follows.",
      },
      {
        type: "h2",
        id: "cpu-and-concurrency",
        text: "CPU and concurrency",
      },
      {
        type: "p",
        text: "Web apps that spend most of their time waiting on I/O can share cores more aggressively than CPU-bound workers. If you already know request rates and average CPU time per request, you can estimate cores needed at peak. Leave headroom for bursts—sudden queue spikes should not pin every core to 100%.",
      },
      {
        type: "h3",
        id: "when-to-scale-up",
        text: "When to scale up vs out",
      },
      {
        type: "p",
        text: "Vertical scaling is simplest when a single primary process owns state. Horizontal scaling wins when you can add identical app nodes behind a load balancer. Choose the path that matches how your software actually deploys today.",
      },
      {
        type: "h2",
        id: "memory-and-disk",
        text: "Memory and disk",
      },
      {
        type: "ul",
        items: [
          "Size RAM for the working set plus OS and buffers—not just the advertised app requirement.",
          "Prefer SSD-backed storage for databases and anything with random reads.",
          "Plan growth: snapshots and logs expand quietly until they do not.",
        ],
      },
      {
        type: "h2",
        id: "validate-before-launch",
        text: "Validate before launch",
      },
      {
        type: "p",
        text: "Run a realistic load test on a staging twin of production. Watch CPU steal, memory pressure, and disk latency—not just average response time. Adjust once with evidence, then document the final size so the next launch is faster.",
      },
    ],
  },
  {
    id: "post-05",
    slug: "when-to-move-from-shared-to-vps",
    title: "When to move from shared hosting to a VPS",
    excerpt:
      "Signals that shared hosting is holding you back—and what to prepare before you migrate.",
    categoryId: "cat-vps",
    tags: ["migration", "vps"],
    coverImageUrl: "/images/showcase/vps-lead.jpg",
    coverImageAlt: "Operator reviewing server metrics",
    featured: false,
    status: "published",
    publishedAt: "2026-02-14T10:00:00.000Z",
    ...BLOG_AUTHOR,
    content: [
      {
        type: "p",
        text: "Shared hosting is fine until it is not. The shift to a VPS should be driven by clear constraints—not by marketing pages.",
      },
      {
        type: "h2",
        id: "signals-it-is-time",
        text: "Signals it is time",
      },
      {
        type: "ul",
        items: [
          "You need custom services, background workers, or specific OS packages.",
          "Noisy neighbors or CPU limits show up as unexplained slowdowns.",
          "You outgrew panel-only workflows and need SSH or full root control.",
        ],
      },
      {
        type: "h2",
        id: "prepare-the-migration",
        text: "Prepare the migration",
      },
      {
        type: "p",
        text: "Inventory DNS TTLs, SSL certificates, databases, and cron jobs. Lower TTLs a day ahead. Stage the new environment, cut over during a quiet window, and keep the old host available until you confirm traffic and mail.",
      },
      {
        type: "h2",
        id: "expect-ops-ownership",
        text: "Expect more ownership",
      },
      {
        type: "p",
        text: "A VPS gives control and responsibility: patches, firewalls, and monitoring become yours. Budget time for that work—or choose managed help that matches your team’s capacity.",
      },
    ],
  },
  {
    id: "post-09",
    slug: "disk-io-and-why-your-vps-feels-slow",
    title: "Disk I/O and why your VPS feels slow",
    excerpt:
      "When CPU looks fine but everything crawls, storage latency is often the culprit.",
    categoryId: "cat-vps",
    tags: ["performance", "disk"],
    coverImageUrl: "/images/showcase/vps-photo-left.jpg",
    coverImageAlt: "Close-up of server hardware",
    featured: false,
    status: "published",
    publishedAt: "2026-01-15T10:30:00.000Z",
    ...BLOG_AUTHOR,
    content: [
      {
        type: "p",
        text: "Teams often upgrade CPU when the real bottleneck is disk. Databases and logging stacks are especially sensitive to latency spikes.",
      },
      {
        type: "h2",
        id: "symptoms",
        text: "Symptoms to notice",
      },
      {
        type: "ul",
        items: [
          "High iowait while CPU user time stays modest.",
          "Query times that jump under write load.",
          "Logs and backups that stall the rest of the system.",
        ],
      },
      {
        type: "h2",
        id: "practical-fixes",
        text: "Practical fixes",
      },
      {
        type: "p",
        text: "Move write-heavy data to faster storage tiers when available. Separate log volume from primary data if contention is clear. Tune retention so cleanup jobs do not hammer the same disks during peak traffic.",
      },
      {
        type: "h2",
        id: "measure-before-buying",
        text: "Measure before buying",
      },
      {
        type: "p",
        text: "Capture baseline latency for a few days. Upgrade only when numbers—not hunches—say storage is the constraint.",
      },
    ],
  },
];
