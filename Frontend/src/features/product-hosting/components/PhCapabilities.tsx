/**
 * Capability grid — numbered like VPS principles, with feature icons.
 */
import type { IconType } from "react-icons";
import {
  HiOutlineCircleStack,
  HiOutlineCog6Tooth,
  HiOutlineComputerDesktop,
  HiOutlineDocumentText,
  HiOutlineGlobeAlt,
  HiOutlineKey,
} from "react-icons/hi2";
import type {
  Capability,
  CapabilityIcon,
} from "@/features/product-hosting/model/productHostingContent";

const CAP_ICONS: Record<CapabilityIcon, IconType> = {
  root: HiOutlineKey,
  admin: HiOutlineCog6Tooth,
  network: HiOutlineGlobeAlt,
  storage: HiOutlineCircleStack,
  images: HiOutlineComputerDesktop,
  clarity: HiOutlineDocumentText,
};

type PhCapabilitiesProps = {
  heading: string;
  subheading: string;
  items: readonly Capability[];
};

export function PhCapabilities({
  heading,
  subheading,
  items,
}: PhCapabilitiesProps) {
  return (
    <section className="phSection" aria-labelledby="ph-caps-heading">
      <div className="phInner">
        <header className="phCenter">
          <h2 id="ph-caps-heading" className="phHeading">
            {heading}
          </h2>
          <p className="phIntro">{subheading}</p>
        </header>
        <ol className="phCapsGrid">
          {items.map((cap) => {
            const Icon = CAP_ICONS[cap.icon];
            return (
              <li key={cap.id} className="phCap">
                <div className="phCapTop">
                  <p className="phCapNumber">
                    <span className="sr-only">Capability {cap.number}. </span>
                    <span aria-hidden="true">
                      {cap.number}
                      <span>.</span>
                    </span>
                  </p>
                  <span className="phCapIcon" aria-hidden>
                    <Icon size={22} />
                  </span>
                </div>
                <h3 className="phCapTitle">{cap.title}</h3>
                <p className="phCapBody">{cap.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
