"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
  size?: "sm" | "md";
}

export function StarRating({ rating, onRate, size = "md" }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const starSize = size === "sm" ? "w-4 h-4" : "w-6 h-6";

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onRate(star === rating ? 0 : star)}
          className="transition-transform hover:scale-125 active:scale-90"
        >
          <Star
            className={cn(
              starSize,
              "transition-colors",
              (hovered || rating) >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground/30"
            )}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="text-xs text-muted-foreground ml-2">{rating}/5</span>
      )}
    </div>
  );
}
