"use client";
import { useState, useEffect, useCallback } from "react";

export function useRatings() {
  const [ratings, setRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    const stored = localStorage.getItem("priismatv_ratings");
    if (stored) setRatings(JSON.parse(stored));
  }, []);

  const rateContent = useCallback((id: string, rating: number) => {
    setRatings((prev) => {
      const updated = { ...prev, [id]: rating };
      localStorage.setItem("priismatv_ratings", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getRating = useCallback((id: string) => ratings[id] || 0, [ratings]);

  return { ratings, rateContent, getRating };
}
