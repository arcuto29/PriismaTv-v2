"use client";
import { Tv } from "lucide-react";
import { useContentStore } from "@/hooks/use-content-store";
import { ContentGrid } from "@/components/content/content-grid";

export default function TvShowsPage() {
  const { tvshows, favorites, watchlist, toggleFavorite, toggleWatchlist, isLoaded } = useContentStore();

  if (!isLoaded) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <ContentGrid
      title="TV Shows"
      icon={<Tv className="w-6 h-6 text-cyan-400" />}
      items={tvshows}
      onFavorite={toggleFavorite}
      onWatchlist={toggleWatchlist}
      favorites={favorites}
      watchlist={watchlist}
    />
  );
}
