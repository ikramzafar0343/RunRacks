/**
 * Centered marketing hero — Sage & Ink; honest trust row (catalog flags).
 */
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export type Hero7TrustAvatar = {
  src: string;
  alt: string;
};

export type Hero7Props = {
  heading?: string;
  description?: string;
  button?: {
    text: string;
    url: string;
  };
  trust?: {
    label: string;
    avatars: readonly Hero7TrustAvatar[];
  };
};

const DEFAULT_TRUST: NonNullable<Hero7Props["trust"]> = {
  label: "8 catalog regions · demo pricing",
  avatars: [
    { src: "/flags/us.svg", alt: "United States" },
    { src: "/flags/gb.svg", alt: "United Kingdom" },
    { src: "/flags/de.svg", alt: "Germany" },
    { src: "/flags/sg.svg", alt: "Singapore" },
    { src: "/flags/au.svg", alt: "Australia" },
  ],
};

export function Hero7({
  heading = "Customize your hosting",
  description = "Choose type, region, and capacity. Totals are demo pricing until checkout is configured.",
  button = {
    text: "Build your plan",
    url: "#cz-config",
  },
  trust = DEFAULT_TRUST,
}: Hero7Props) {
  return (
    <section className="px-4 pb-10 pt-24 md:pb-12 md:pt-28">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-heading lg:text-5xl">
            {heading}
          </h1>
          <p className="text-balance text-base text-muted-foreground lg:text-lg">
            {description}
          </p>
        </div>

        <Button asChild size="lg" variant="default" className="mt-8">
          <a href={button.url}>{button.text}</a>
        </Button>

        <div className="mx-auto mt-9 flex w-fit flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <span className="inline-flex items-center -space-x-3">
            {trust.avatars.map((avatar) => (
              <Avatar
                key={avatar.src}
                className="size-11 border-2 border-surface bg-accent-soft shadow-sm"
              >
                <AvatarImage
                  src={avatar.src}
                  alt={avatar.alt}
                  className="object-cover"
                />
              </Avatar>
            ))}
          </span>
          <p className="text-left text-sm font-medium text-muted-foreground">
            {trust.label}
          </p>
        </div>
      </div>
    </section>
  );
}
