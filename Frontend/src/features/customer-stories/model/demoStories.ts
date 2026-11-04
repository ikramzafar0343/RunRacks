/**
 * Labeled demo customer stories — UI only, not verified testimonials.
 * Portraits: illustrative natural-home pack (AI-generated fictional people).
 */
import type {
  CustomerStoriesPayload,
  CustomerStory,
} from "@/features/customer-stories/model/types";
import { getPublishedStories } from "@/features/customer-stories/model/validation";

const MEDIA = "/media/customer-stories/natural-15/webp-landscape";
/** Featured count for marketing carousels (home / product). */
export const FEATURED_STORY_COUNT = 6;

type DemoSeed = {
  id: string;
  slug: string;
  customerName: string;
  role: string;
  companyName: string;
  quote: string;
  file: string;
  focal?: string;
};

const SEEDS: readonly DemoSeed[] = [
  {
    id: "demo-01",
    slug: "demo-maya-chen",
    customerName: "Maya Chen",
    role: "Founder",
    companyName: "Bright Desk Studio (demo)",
    quote:
      "Really happy with the service. I had a few questions before getting started, and everything was explained clearly. No pressure, no complicated answers. Just a genuinely helpful experience.",
    file: "testimonial-01.webp",
  },
  {
    id: "demo-02",
    slug: "demo-priya-shah",
    customerName: "Priya Shah",
    role: "Operations coordinator",
    companyName: "Fieldline Ops (demo)",
    quote:
      "Honestly, much easier than I expected. Got the help I needed without going back and forth a hundred times. Appreciate how smoothly everything was handled.",
    file: "testimonial-02.webp",
  },
  {
    id: "demo-03",
    slug: "demo-marcus-hale",
    customerName: "Marcus Hale",
    role: "Engineering manager",
    companyName: "Northline Labs (demo)",
    quote:
      "I'm not particularly good with technical stuff, so I usually end up asking a lot of questions. The person helping me was patient and never made me feel like I was wasting their time. That meant a lot.",
    file: "testimonial-03.webp",
  },
  {
    id: "demo-04",
    slug: "demo-aisha-rahman",
    customerName: "Aisha Rahman",
    role: "Team lead",
    companyName: "Harbor Soft (demo)",
    quote:
      "I wasn't sure what to expect at first. I'd had a frustrating experience with another service before, so I was a little hesitant. But communication was good, and I felt comfortable throughout the process.",
    file: "testimonial-04.webp",
  },
  {
    id: "demo-05",
    slug: "demo-daniel-okonkwo",
    customerName: "Daniel Okonkwo",
    role: "IT manager",
    companyName: "Cedar Stack (demo)",
    quote:
      "What stood out to me was the communication. I didn't have to keep chasing for an answer. Whenever I needed clarification, someone was there to explain things properly.",
    file: "testimonial-05.webp",
  },
  {
    id: "demo-06",
    slug: "demo-elena-vargas",
    customerName: "Elena Vargas",
    role: "Small business owner",
    companyName: "Verde Retail (demo)",
    quote:
      "Good experience overall. Everything was straightforward, and the support team was friendly. There was a small delay with one of my questions, but they followed up and sorted it out.",
    file: "testimonial-06.webp",
  },
  {
    id: "demo-07",
    slug: "demo-liam-brooks",
    customerName: "Liam Brooks",
    role: "Freelance developer",
    companyName: "Independent (demo)",
    quote:
      "I appreciate dealing with people who actually listen instead of giving the same standard response to every question. They took the time to understand what I needed, which made the whole experience better.",
    file: "testimonial-07.webp",
  },
  {
    id: "demo-08",
    slug: "demo-fatima-noor",
    customerName: "Fatima Noor",
    role: "Community manager",
    companyName: "Atlas Mentors (demo)",
    quote:
      "With work and family, I really don't have time for complicated processes. Thankfully, this was pretty simple. I got clear instructions and didn't have to spend hours figuring things out.",
    file: "testimonial-08.webp",
  },
  {
    id: "demo-09",
    slug: "demo-noah-kim",
    customerName: "Noah Kim",
    role: "Indie developer",
    companyName: "Sidebench Apps (demo)",
    quote:
      "I don't usually leave reviews, but I wanted to share this one. The experience was genuinely pleasant. Friendly people, clear answers, and no unnecessary hassle.",
    file: "testimonial-09.webp",
  },
  {
    id: "demo-10",
    slug: "demo-sofia-almeida",
    customerName: "Sofia Almeida",
    role: "Agency producer",
    companyName: "Lumen Creative (demo)",
    quote:
      "The best part was how comfortable the conversation felt. It didn't seem like someone was just trying to finish the call quickly. They listened, answered my questions, and made sure I understood everything.",
    file: "testimonial-10.webp",
  },
  {
    id: "demo-11",
    slug: "demo-jamal-wright",
    customerName: "Jamal Wright",
    role: "Support lead",
    companyName: "Relay Desk (demo)",
    quote:
      "Nothing overly complicated, which is exactly what I wanted. I explained my situation, got the information I needed, and was able to move forward. I'd be happy to use the service again.",
    file: "testimonial-11.webp",
  },
  {
    id: "demo-12",
    slug: "demo-ananya-desai",
    customerName: "Ananya Desai",
    role: "Product operations",
    companyName: "Kinetic Flow (demo)",
    quote:
      "I had one issue that needed a bit more attention than expected. It wasn't resolved immediately, but I appreciated that they kept me informed rather than leaving me wondering what was happening.",
    file: "testimonial-12.webp",
  },
  {
    id: "demo-13",
    slug: "demo-olivia-hart",
    customerName: "Olivia Hart",
    role: "Studio coordinator",
    companyName: "Oak & Ink (demo)",
    quote:
      "Pretty solid experience, to be fair. The team was easy to talk to, and they explained everything in a way that actually made sense. Would definitely recommend giving them a try.",
    file: "testimonial-13.webp",
  },
  {
    id: "demo-14",
    slug: "demo-layla-hassan",
    customerName: "Layla Hassan",
    role: "Customer success",
    companyName: "Summit Care (demo)",
    quote:
      "It's refreshing when customer service feels like an actual conversation. Nobody rushed me or made things unnecessarily difficult. Just polite, respectful help from beginning to end.",
    file: "testimonial-14.webp",
  },
  {
    id: "demo-15",
    slug: "demo-ethan-cole",
    customerName: "Ethan Cole",
    role: "Systems administrator",
    companyName: "Pinehost Ops (demo)",
    quote:
      "Overall, I'm satisfied. There were a couple of things I needed to clarify along the way, but the team handled my questions professionally. I especially appreciated the patience and willingness to help.",
    file: "testimonial-15.webp",
  },
];

function toStory(seed: DemoSeed, order: number): CustomerStory {
  return {
    id: seed.id,
    slug: seed.slug,
    customerName: seed.customerName,
    role: seed.role,
    companyName: seed.companyName,
    quote: seed.quote,
    portraitUrl: `${MEDIA}/${seed.file}`,
    portraitAlt: `Illustrative demo portrait for ${seed.customerName} — fictional person, not a verified customer photo`,
    mediaFocalPoint: seed.focal ?? "center 28%",
    displayOrder: order,
    published: true,
  };
}

function buildPayload(stories: CustomerStory[]): CustomerStoriesPayload {
  return {
    source: "demo",
    notice:
      "Demo stories with illustrative portraits — not verified customer testimonials",
    stories,
  };
}

/** Full demo catalog (case studies page). */
export function getDemoCustomerStories(): CustomerStoriesPayload {
  return buildPayload(
    getPublishedStories(SEEDS.map((seed, index) => toStory(seed, index + 1))),
  );
}

/** First N stories for home/product carousels. */
export function getFeaturedDemoCustomerStories(
  count = FEATURED_STORY_COUNT,
): CustomerStoriesPayload {
  const all = getDemoCustomerStories();
  return buildPayload(all.stories.slice(0, count));
}
