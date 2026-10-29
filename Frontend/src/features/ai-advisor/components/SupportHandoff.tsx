/**
 * Real App Router destinations — no fake ticket submission.
 */
import Link from "next/link";
import { AI_HANDOFF_LINKS } from "@/features/ai-advisor/model/aiContent";

export function SupportHandoff() {
  return (
    <nav className="aiAdvisorHandoff" aria-label="Continue without AI">
      {AI_HANDOFF_LINKS.map((link) => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
