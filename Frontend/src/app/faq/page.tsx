/**
 * FAQ — canonical VPS hosting education set.
 */
import type { Metadata } from "next";
import { FaqSection } from "@/features/vps-faq/components/FaqSection";

export const metadata: Metadata = {
  title: "VPS Hosting FAQ | RunRacks",
  description:
    "Answers about Linux VPS, KVM isolation, plan sizing, and getting started on RunRacks. Demo prices stay labeled until checkout.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <main className="faqPage rrDenseSpacing flex flex-1 flex-col">
      <FaqSection page />
    </main>
  );
}
