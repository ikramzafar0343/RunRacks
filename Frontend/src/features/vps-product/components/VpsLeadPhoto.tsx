/**
 * Wide lead photograph with reserved aspect ratio.
 */
import Image from "next/image";
import { VpsLeadPhotoExpand } from "@/features/vps-product/components/VpsLeadPhotoExpand";
import { VPS_PRODUCT } from "@/features/vps-product/model/vpsProductContent";
import "@/features/vps-product/components/vps-lead-photo.css";

export function VpsLeadPhoto() {
  const { lead } = VPS_PRODUCT;
  return (
    <section className="vpsLeadPhoto" aria-label={lead.alt}>
      <VpsLeadPhotoExpand>
        <Image
          className="vpsLeadPhotoImg"
          src={lead.src}
          alt={lead.alt}
          width={lead.width}
          height={lead.height}
          sizes="(max-width: 767px) 100vw, min(1600px, 100vw)"
          style={{ objectPosition: lead.objectPosition }}
          quality={75}
        />
      </VpsLeadPhotoExpand>
    </section>
  );
}
