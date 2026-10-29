/**
 * Asymmetric story — tall portrait left, copy + two small photos right.
 */
import Image from "next/image";
import { ADMIN_RDP } from "@/features/admin-rdp/model/adminRdpContent";
import "@/features/admin-rdp/components/admin-rdp-stories.css";

export function ArdpStoryIdeas() {
  const { storyIdeas } = ADMIN_RDP;

  return (
    <section className="ardpStory" aria-labelledby="ardp-story-ideas">
      <div className="ardpInner ardpStoryAsym">
        <div className="ardpStoryPortrait">
          <Image
            className="ardpMedia"
            src={storyIdeas.portrait.src}
            alt={storyIdeas.portrait.alt}
            width={1000}
            height={1000}
            sizes="(max-width: 899px) 100vw, 45vw"
          />
        </div>

        <div className="ardpStoryRight">
          <div className="ardpStoryCopy">
            <p className="ardpEyebrow">{storyIdeas.eyebrow}</p>
            <h2 id="ardp-story-ideas" className="sr-only">
              Remote desktops that keep up
            </h2>
            <p className="ardpBody">{storyIdeas.body}</p>
          </div>

          <div className="ardpStoryPair">
            {storyIdeas.pair.map((img) => (
              <div key={img.src} className="ardpMediaFrame">
                <Image
                  className="ardpMedia"
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={600}
                  sizes="(max-width: 899px) 45vw, 22vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
