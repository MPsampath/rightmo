interface StarRatingProps {
  rating: number;
  maxStars?: number;
  className?: string;
}

// Renders a 5-star visual rating, filling stars proportionally based on `rating`.
export default function StarRating({
  rating,
  maxStars = 5,
  className = "",
}: StarRatingProps) {
  const clamped = Math.max(0, Math.min(rating, maxStars));

  return (
    <div
      className={`flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`Rated ${clamped} out of ${maxStars} stars`}
    >
      {Array.from({ length: maxStars }, (_, index) => {
        const fillPercent = Math.max(0, Math.min(clamped - index, 1)) * 100;
        return (
          <span key={index} className="relative inline-block h-4 w-4">
            <svg
              viewBox="0 0 20 20"
              className="absolute inset-0 h-4 w-4 text-zinc-300 dark:text-zinc-700"
              fill="currentColor"
            >
              <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
            </svg>
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4 text-yellow-400"
                fill="currentColor"
              >
                <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
              </svg>
            </span>
          </span>
        );
      })}
      <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400">
        {clamped.toFixed(1)}
      </span>
    </div>
  );
}
