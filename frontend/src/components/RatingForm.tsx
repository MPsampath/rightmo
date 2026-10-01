"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { submitProductRating } from "@/lib/products";
import { getApiErrorMessage } from "@/lib/errors";

interface RatingFormProps {
  productId: number;
}

const STAR_VALUES = [1, 2, 3, 4, 5];

export default function RatingForm({ productId }: RatingFormProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!selected) {
      toast("Please select a star rating.", { icon: "⚠️" });
      return;
    }
    setSubmitting(true);
    try {
      await submitProductRating(productId, selected);
      toast.success("Thanks for your rating!");
      setSubmitted(true);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        You rated this product {selected} star{selected > 1 ? "s" : ""}. Thank you!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Rate this product
      </span>
      <div className="flex items-center gap-1">
        {STAR_VALUES.map((value) => {
          const filled = value <= (hoverValue || selected);
          return (
            <button
              key={value}
              type="button"
              aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
              onMouseEnter={() => setHoverValue(value)}
              onMouseLeave={() => setHoverValue(0)}
              onClick={() => setSelected(value)}
              className="h-7 w-7"
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`h-7 w-7 ${filled ? "text-yellow-400" : "text-zinc-300 dark:text-zinc-700"}`}
              >
                <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
              </svg>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || !selected}
        className="w-fit rounded-md bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {submitting ? "Submitting…" : "Submit rating"}
      </button>
    </div>
  );
}
