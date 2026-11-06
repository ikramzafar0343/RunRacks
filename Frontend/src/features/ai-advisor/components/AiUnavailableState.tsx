/**
 * Short unavailable / error line. Links are real routes.
 */
import { SupportHandoff } from "@/features/ai-advisor/components/SupportHandoff";

type AiUnavailableStateProps = {
  message: string;
  variant?: "unavailable" | "error";
  onRetry?: (() => void) | undefined;
};

export function AiUnavailableState({
  message,
  variant = "unavailable",
  onRetry,
}: AiUnavailableStateProps) {
  return (
    <div
      className={
        variant === "error"
          ? "aiAdvisorBanner aiAdvisorBanner--error"
          : "aiAdvisorBanner"
      }
      role={variant === "error" ? "alert" : "status"}
    >
      <p>{message}</p>
      {variant === "unavailable" ? <SupportHandoff /> : null}
      {variant === "error" && onRetry ? (
        <button type="button" className="aiBannerRetry" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
