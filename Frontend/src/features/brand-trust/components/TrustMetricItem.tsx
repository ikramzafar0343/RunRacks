/**
 * Single trust metric — marker (avatars or icon) + value + caption.
 */
import Image from "next/image";
import type {
  TrustAvatar,
  TrustMetric,
} from "@/features/brand-trust/model/brandTrustContent";

type TrustMetricItemProps = {
  metric: TrustMetric;
  avatars: readonly TrustAvatar[];
};

function SmileIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle
        cx="12"
        cy="12"
        r="8.25"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 10.25h.01M15 10.25h.01"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M8.75 13.75c.9 1.55 2.25 2.35 3.25 2.35s2.35-.8 3.25-2.35"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.8l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 9l5-.7L12 3.8z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 13V11a7.5 7.5 0 0 1 15 0v2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M4.5 13.5v3a1.5 1.5 0 0 0 1.5 1.5H8v-6H6a1.5 1.5 0 0 0-1.5 1.5zM19.5 13.5v3a1.5 1.5 0 0 1-1.5 1.5H16v-6h2a1.5 1.5 0 0 1 1.5 1.5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MetricIcon({ icon }: { icon: TrustMetric["icon"] }) {
  if (icon === "smile") return <SmileIcon />;
  if (icon === "star") return <StarIcon />;
  if (icon === "headset") return <HeadsetIcon />;
  return null;
}

export function TrustMetricItem({ metric, avatars }: TrustMetricItemProps) {
  return (
    <div className="trustMetric">
      <div className="trustMarker" aria-hidden={metric.icon !== "avatars"}>
        {metric.icon === "avatars" ? (
          <div
            className="trustAvatars"
            role="img"
            aria-label="Demo customer portraits — not verified"
          >
            {avatars.map((avatar) =>
              avatar.kind === "image" && avatar.src ? (
                <Image
                  key={avatar.id}
                  src={avatar.src}
                  alt=""
                  width={76}
                  height={76}
                  className="trustAvatar"
                />
              ) : (
                <span
                  key={avatar.id}
                  className="trustAvatar trustAvatarInitials"
                  aria-hidden="true"
                >
                  {avatar.initials}
                </span>
              ),
            )}
          </div>
        ) : (
          <div className="trustIconDisk">
            <MetricIcon icon={metric.icon} />
          </div>
        )}
      </div>
      <p className="trustValue">{metric.displayValue}</p>
      <p className="trustCaption">{metric.label}</p>
    </div>
  );
}
