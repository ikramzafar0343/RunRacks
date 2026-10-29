/**
 * FAQ — same questions already used on the home page.
 */
import type { Metadata } from "next";
import { FaqSection } from "@/features/vps-faq/components/FaqSection";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about RunRacks VPS, Windows, and Admin RDP plans. Demo prices stay labeled until checkout is configured.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <main className="flex flex-1 flex-col">
      <FaqSection page />
    </main>
  );
}
