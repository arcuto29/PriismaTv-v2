"use client";
import { Sword } from "lucide-react";
import { useContentStore } from "@/hooks/use-content-store";
import { ContentGrid } from "@/components/content/content-grid";

export default function AnimePage() {
  const { anime, favorites, watchlist, toggleFavorite, toggleWatchlist, isLoaded } = useContentStore();

  if (!isLoaded) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <ContentGrid
      title="Anime"
      icon={<Sword className="w-6 h-6 text-purple-400" />}
      items={anime}
      onFavorite={toggleFavorite}
      onWatchlist={toggleWatchlist}
      favorites={favorites}
      watchlist={watchlist}
    />
  );
}
