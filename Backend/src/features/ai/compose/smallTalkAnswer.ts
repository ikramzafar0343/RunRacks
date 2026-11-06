/**
 * Small-talk and identity handlers (greetings, capabilities, locations).
 */
import type { ConversationStateV1 } from "../types/state.js";
import type { ComposedTurn } from "../types/turn.js";
import { chipsBlock, links } from "./blocks.js";
import { hasPhrase } from "../pipeline/normalize.js";

export function trySmallTalkAnswer(input: {
  matching: string;
  state: ConversationStateV1;
  evidenceIds: string[];
}): ComposedTurn | null {
  const m = input.matching;
  const state = { ...input.state };

  // "How are you"
  if (
    hasPhrase(m, "how are you") ||
    hasPhrase(m, "how r u") ||
    hasPhrase(m, "how about you") ||
    hasPhrase(m, "what about you") ||
    hasPhrase(m, "kaise ho") ||
    hasPhrase(m, "kese ho")
  ) {
    state.activeIntent = "greeting";
    state.lastAnswerTemplateId = "greet_how_are_you_v1";
    state.lastAdvisorAsk = "host";
    return {
      text:
        state.language === "roman_urdu"
          ? "Main theek hoon, shukriya! Main RunRacks ka automated hosting advisor hoon. Main aap ko best VPS ya Admin RDP choose karne mein madad kar sakta hoon. Aap kya host karna chahte hain?"
          : "I'm doing well, thank you for asking! I'm RunRacks' automated hosting advisor. How can I help you today — are you looking for a Linux VPS, Windows VPS, or Admin RDP?",
      blocks: [
        chipsBlock([
          { id: "workload_website", label: "Linux VPS (Website/API)" },
          { id: "workload_app", label: "Windows VPS" },
          { id: "workload_rdp", label: "Admin RDP" },
        ]),
      ],
      templateId: "greet_how_are_you_v1",
      state,
      evidenceIds: input.evidenceIds,
    };
  }

  if (
    hasPhrase(m, "about yourself") ||
    hasPhrase(m, "who are you") ||
    hasPhrase(m, "introduce yourself") ||
    (hasPhrase(m, "what are you") && !hasPhrase(m, "doing")) ||
    hasPhrase(m, "tell me about you")
  ) {
    state.activeIntent = "capabilities";
    state.lastAnswerTemplateId = "caps_self_v1";
    return {
      text: "I’m RunRacks’ owned hosting advisor. I am not a human and not a general-purpose model. I explain RunRacks services, read the published plan cards (vCPU, RAM, NVMe, access, OS, regions, and labeled demo prices), and help you compare Linux VPS, Windows VPS, and Admin RDP. I can’t place orders, open tickets, or change a server from chat.",
      blocks: [
        chipsBlock([
          { id: "intent_pricing", label: "VPS 1 specs" },
          { id: "workload_app", label: "Windows plans" },
          { id: "workload_rdp", label: "Admin RDP plans" },
        ]),
        links(),
      ],
      templateId: "caps_self_v1",
      state,
      evidenceIds: input.evidenceIds,
    };
  }

  if (
    hasPhrase(m, "what is runracks") ||
    hasPhrase(m, "what is run racks") ||
    hasPhrase(m, "what is runrack") ||
    hasPhrase(m, "who is runracks") ||
    hasPhrase(m, "about runracks") ||
    hasPhrase(m, "about runrack") ||
    hasPhrase(m, "what runracks")
  ) {
    state.activeIntent = "capabilities";
    state.lastAnswerTemplateId = "caps_brand_v1";
    state.lastAdvisorAsk = "identity";
    return {
      text: "RunRacks is a hosting brand for teams that want documented server plans and administrator access. The public catalog is three families: Linux VPS (root access for sites and apps), Windows VPS (Windows Server workloads), and Admin RDP (administrator Windows desktops over remote desktop). Plan cards list vCPU, RAM, NVMe, access, OS images, and regions. Prices on the site are labeled demo until billing and checkout are connected.",
      blocks: [links()],
      templateId: "caps_brand_v1",
      state,
      evidenceIds: input.evidenceIds,
    };
  }

  if (
    hasPhrase(m, "what services") ||
    hasPhrase(m, "type of services") ||
    hasPhrase(m, "services do you") ||
    hasPhrase(m, "services does") ||
    hasPhrase(m, "what do you offer") ||
    hasPhrase(m, "what do you provide") ||
    hasPhrase(m, "hosting services") ||
    (/\bservices\b/.test(m) && /runrack/.test(m))
  ) {
    state.activeIntent = "capabilities";
    state.lastAnswerTemplateId = "caps_services_v1";
    return {
      text: "RunRacks publishes three hosting services. Linux VPS: isolated Linux servers with full root access for websites, APIs, and databases (cards VPS 1 through VPS 6). Windows VPS: Windows Server with administrator access (Windows VPS 1, 3, 5, 7, 9, 11). Admin RDP: Windows desktops aimed at remote administrator work (Admin RDP 1, 3, 5, 7, 9, 11). Each card shows vCPU, RAM, NVMe, and a demo monthly price. Name a plan and I’ll read that card in full.",
      blocks: [
        chipsBlock([
          { id: "workload_website", label: "Linux VPS plans" },
          { id: "workload_app", label: "Windows VPS plans" },
          { id: "workload_rdp", label: "Admin RDP plans" },
        ]),
        links(),
      ],
      templateId: "caps_services_v1",
      state,
      evidenceIds: input.evidenceIds,
    };
  }

  // "What are you doing"
  if (
    hasPhrase(m, "what are you doing") ||
    hasPhrase(m, "what r u doing") ||
    hasPhrase(m, "kya kar rahe ho")
  ) {
    state.activeIntent = "capabilities";
    state.lastAnswerTemplateId = "caps_doing_v1";
    state.lastAdvisorAsk = "identity";
    return {
      text:
        state.language === "roman_urdu"
          ? "Main RunRacks par visitors ki hosting talash karne mein madad kar raha hoon — plans, specs, aur pricing explain karta hoon taake aap behtareen server choose kar sakein. Aap kya host karna chahte hain?"
          : "I'm assisting visitors with RunRacks cloud hosting — recommending Linux VPS, Windows VPS, and Admin RDP plans, sizing specs, explaining pricing, and helping you pick the right datacenter. What are you looking to host?",
      blocks: [
        chipsBlock([
          { id: "workload_website", label: "Website hosting" },
          { id: "intent_pricing", label: "View plans & pricing" },
          { id: "workload_rdp", label: "Admin RDP" },
        ]),
        links(),
      ],
      templateId: "caps_doing_v1",
      state,
      evidenceIds: input.evidenceIds,
    };
  }

  // "Where are you from" / "Where are your servers located"
  if (
    hasPhrase(m, "where are you from") ||
    hasPhrase(m, "where r u from") ||
    hasPhrase(m, "where are you located") ||
    hasPhrase(m, "where are your servers") ||
    hasPhrase(m, "where is runracks") ||
    hasPhrase(m, "where are your datacenters") ||
    hasPhrase(m, "datacenter locations") ||
    hasPhrase(m, "server locations")
  ) {
    state.activeIntent = "capabilities";
    state.lastAnswerTemplateId = "caps_locations_v1";
    return {
      text:
        state.language === "roman_urdu"
          ? "RunRacks ke 8 global tier-3/4 datacenters hain: United States, Canada, United Kingdom, Netherlands, Germany, Singapore, Australia, aur Japan. Main RunRacks ka automated AI advisor hoon jo aap ko nearest server aur behtareen hosting plan choose karne mein madad karta hai."
          : "RunRacks operates across 8 enterprise datacenter locations globally: United States, Canada, United Kingdom, Netherlands, Germany, Singapore, Australia, and Japan. I am RunRacks' automated AI hosting advisor, designed to help you find the best hosting plan and nearest low-latency server for your needs.",
      blocks: [
        chipsBlock([
          { id: "workload_website", label: "Website hosting" },
          { id: "intent_pricing", label: "View plans & pricing" },
          { id: "workload_rdp", label: "Admin RDP" },
        ]),
        links(),
      ],
      templateId: "caps_locations_v1",
      state,
      evidenceIds: input.evidenceIds,
    };
  }

  const trust = trustChooseKind(m);
  if (trust) {
    state.activeIntent = "capabilities";
    state.lastAnswerTemplateId =
      trust === "brand" ? "trust_brand_v1" : "trust_advisor_v1";
    state.lastAdvisorAsk = "trust";
    return {
      text:
        trust === "brand"
          ? "RunRacks has organized its preview around a clear choice of Linux VPS, Windows VPS and Admin RDP, with visible capacity dimensions and catalog regions. Its checkout, pricing and legal terms are not yet ready for a binding purchase; compare the concept now and verify the actual offer before committing."
          : "I’m an automated RunRacks advisor, not a person you can hold to an uptime record. Prices on the site are labeled demo until billing and checkout are connected. I can’t show a founding year or a customer review from chat. A human is on the Contact page.",
      blocks: [links()],
      templateId: state.lastAnswerTemplateId,
      state,
      evidenceIds: input.evidenceIds,
    };
  }

  return null;
}

function trustChooseKind(matching: string): "brand" | "advisor" | null {
  if (!/\bwhy\b/.test(matching) || !/\b(trust|choose)\b/.test(matching)) {
    return null;
  }
  if (/\brun ?rack/.test(matching)) return "brand";
  if (/\byou\b/.test(matching)) return "advisor";
  return null;
}

