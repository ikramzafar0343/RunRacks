/**
 * Split product story — label + word-fill paragraphs.
 */
import { VpsStoryWordFill } from "@/features/vps-product/components/VpsStoryWordFill";
import { VPS_PRODUCT } from "@/features/vps-product/model/vpsProductContent";
import "@/features/vps-product/components/vps-product-story.css";

export function VpsProductStory() {
  const { story } = VPS_PRODUCT;
  return (
    <section
      className="vpsProductStory"
      id="vps-product-story"
      aria-labelledby="vps-product-story-label"
    >
      <div className="vpsProductStoryInner">
        <h2 id="vps-product-story-label" className="vpsProductStoryLabel">
          {story.label}
        </h2>
        <div className="vpsProductStoryCopy">
          <VpsStoryWordFill paragraphs={story.paragraphs} />
        </div>
      </div>
    </section>
  );
}
