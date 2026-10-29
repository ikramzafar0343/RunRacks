/**
 * Circular previous/next control for customer stories.
 */
type CarouselArrowProps = {
  direction: "prev" | "next";
  onClick: () => void;
  className?: string;
};

export function CarouselArrow({
  direction,
  onClick,
  className,
}: CarouselArrowProps) {
  const label =
    direction === "prev" ? "Previous customer story" : "Next customer story";

  return (
    <button
      type="button"
      className={`csArrow csArrow--${direction}${className ? ` ${className}` : ""}`}
      aria-label={label}
      onClick={onClick}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        {direction === "prev" ? (
          <path
            d="M12.5 4.5 7 10l5.5 5.5"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M7.5 4.5 13 10l-5.5 5.5"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
