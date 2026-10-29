/**
 * Contact — message form + real support channels.
 */
import type { Metadata } from "next";
import { ContactPage } from "@/features/contact/components/ContactPage";
import { CONTACT_META } from "@/features/contact/model/contactContent";

export const metadata: Metadata = {
  title: CONTACT_META.title,
  description: CONTACT_META.description,
  alternates: { canonical: "/contact" },
};

export default function ContactRoutePage() {
  return (
    <main className="flex flex-1 flex-col">
      <ContactPage />
    </main>
  );
}
