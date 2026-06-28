"use client";
import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { ContentItem } from "@/data/content";
import { ContentRow } from "./content-row";

interface RecommendationsProps {
  content: ContentItem[];
  history: { id: string; date: string }[];
  favorites: string[];
  watchlist: string[];
  onFavorite: (id: string) => void;
  onWatchlist: (id: string) => void;
}

export function Recommendations({
  content, history, favorites, watchlist, onFavorite, onWatchlist,
}: RecommendationsProps) {
  const recommendations = useMemo(() => {
    if (history.length === 0) return null;

    // Get the last watched item
    const lastWatched = content.find((c) => c.id === history[0]?.id);
    if (!lastWatched) return null;

    // Find similar content (same genre, same type, or high-rated)
    const similar = content
      .filter((c) => 
        c.id !== lastWatched.id &&
        !history.some((h) => h.id === c.id) &&
        (c.genre === lastWatched.genre || c.type === lastWatched.type)
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 15);

    if (similar.length === 0) return null;

    return {
      title: `Because you watched ${lastWatched.title}`,
      items: similar,
    };
  }, [content, history]);

  if (!recommendations) return null;

  return (
    <ContentRow
      title={recommendations.title}
      icon={<Sparkles className="w-4 h-4 text-yellow-400" />}
      items={recommendations.items}
      onFavorite={onFavorite}
      onWatchlist={onWatchlist}
      favorites={favorites}
      watchlist={watchlist}
    />
  );
}
