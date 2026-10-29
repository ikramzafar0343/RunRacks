/**
 * Asymmetric editorial photo pair.
 */
import Image from "next/image";
import { VPS_PRODUCT } from "@/features/vps-product/model/vpsProductContent";
import "@/features/vps-product/components/vps-photo-pair.css";

export function VpsPhotoPair() {
  const { left, right } = VPS_PRODUCT.photoPair;
  return (
    <section
      className="vpsPhotoPair"
      id="vps-photo-pair"
      aria-label="Product photography"
    >
      <div className="vpsPhotoPairInner">
        <figure className="vpsPhotoPairFigure vpsPhotoPairLeft">
          <Image
            src={left.src}
            alt={left.alt}
            width={left.width}
            height={left.height}
            sizes="(max-width: 767px) 100vw, 45vw"
            style={{ objectPosition: left.objectPosition }}
            loading="lazy"
          />
        </figure>
        <figure className="vpsPhotoPairFigure vpsPhotoPairRight">
          <Image
            src={right.src}
            alt={right.alt}
            width={right.width}
            height={right.height}
            sizes="(max-width: 767px) 86vw, 36vw"
            style={{ objectPosition: right.objectPosition }}
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  );
}
