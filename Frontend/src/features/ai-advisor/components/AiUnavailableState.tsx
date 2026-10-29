/**
 * Short unavailable / error line. Links are real routes.
 */
import { AI_COPY } from "@/features/ai-advisor/model/aiContent";
import { SupportHandoff } from "@/features/ai-advisor/components/SupportHandoff";

type AiUnavailableStateProps = {
  message: string;
  variant?: "unavailable" | "error";
};

export function AiUnavailableState({
  message,
  variant = "unavailable",
}: AiUnavailableStateProps) {
  const text = variant === "unavailable" ? AI_COPY.unavailable : message;

  return (
    <div
      className={
        variant === "error"
          ? "aiAdvisorBanner aiAdvisorBanner--error"
          : "aiAdvisorBanner"
      }
      role={variant === "error" ? "alert" : "status"}
    >
      <p>{text}</p>
      {variant === "unavailable" ? <SupportHandoff /> : null}
    </div>
  );
}
