"use client";
import { useContentStore } from "@/hooks/use-content-store";
import { Achievements } from "@/components/features/achievements";

export default function AchievementsPage() {
  const { content, history, favorites, watchlist, isLoaded } = useContentStore();

  if (!isLoaded) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <Achievements
      historyCount={history.length}
      favoritesCount={favorites.length}
      watchlistCount={watchlist.length}
      contentCount={content.length}
    />
  );
}
