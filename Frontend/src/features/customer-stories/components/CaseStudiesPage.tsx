/**
 * /resources/case-studies — on-site stories already in the demo catalog.
 * No invented customers or unpublished article bodies.
 */
import Image from "next/image";
import { getDemoCustomerStories } from "@/features/customer-stories/model/demoStories";

export function CaseStudiesPage() {
  const payload = getDemoCustomerStories();
  const stories = payload.stories.filter((story) => story.quote.trim());

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 pb-20 pt-28 md:pt-32">
      <p className="text-sm font-medium tracking-wide text-muted-foreground">Resources</p>
      <h1 className="mt-2 font-sans text-3xl font-medium tracking-tight text-heading md:text-4xl">
        Case studies
      </h1>
      <p className="mt-4 text-base leading-relaxed text-body md:text-lg">
        These are the on-site stories already shown on RunRacks. They are demo
        stories, not verified customer testimonials. A longer article is not
        published for any of them.
      </p>
      {payload.notice ? (
        <p className="mt-4 text-sm text-muted-foreground" role="note">
          {payload.notice}
        </p>
      ) : null}

      {stories.length === 0 ? (
        <p className="mt-10 text-base leading-relaxed text-body">
          No published case study is available yet.
        </p>
      ) : (
        <ul className="mt-10 flex list-none flex-col gap-6 p-0">
          {stories.map((story) => (
            <li key={story.id}>
              <article className="overflow-hidden rounded-2xl border border-border bg-surface">
                <div className="relative aspect-[16/9] bg-accent-soft">
                  <Image
                    src={story.portraitUrl}
                    alt={story.portraitAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 720px"
                    className="object-cover"
                    style={{
                      objectPosition: story.mediaFocalPoint ?? "center 35%",
                    }}
                  />
                </div>
                <div className="px-5 py-6 md:px-7">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground">
                    On-site story
                  </p>
                  <blockquote className="mt-3 text-lg font-medium leading-snug tracking-tight text-heading">
                    <p>&ldquo;{story.quote}&rdquo;</p>
                  </blockquote>
                  <p className="mt-4 text-sm font-semibold text-heading">
                    {story.customerName}
                  </p>
                  {story.role || story.companyName ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[story.role, story.companyName]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  ) : null}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
