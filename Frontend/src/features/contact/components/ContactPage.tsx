/**
 * Contact — hero, channels, form, FAQ, support closing band.
 */
import { ContactChannels } from "@/features/contact/components/ContactChannels";
import { ContactFaqMotion } from "@/features/contact/components/ContactFaqMotion";
import { ContactFormSection } from "@/features/contact/components/ContactFormSection";
import { ContactHero } from "@/features/contact/components/ContactHero";
import { CONTACT_FAQ } from "@/features/contact/model/contactContent";
import { SupportCtaSection } from "@/features/support-cta/components/SupportCtaSection";
import { SUPPORT_CTA_CONTACT } from "@/features/support-cta/model/supportCtaContent";
import { FaqSection } from "@/features/vps-faq/components/FaqSection";
import "@/features/about/components/about-page.css";
import "@/features/contact/components/contact.css";
import "@/features/contact/components/contact-form.css";

export function ContactPage() {
  return (
    <div className="contactPage rrDenseSpacing">
      <ContactHero />
      <ContactChannels />
      <ContactFormSection />
      <ContactFaqMotion>
        <FaqSection content={CONTACT_FAQ} />
      </ContactFaqMotion>
      <SupportCtaSection content={SUPPORT_CTA_CONTACT} />
    </div>
  );
}
