"use client";
import { History } from "lucide-react";
import { useContentStore } from "@/hooks/use-content-store";
import { ContentCard } from "@/components/content/content-card";

export default function HistoryPage() {
  const { content, history, favorites, watchlist, toggleFavorite, toggleWatchlist, isLoaded } = useContentStore();

  if (!isLoaded) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const items = history
    .map((h) => content.find((c) => c.id === h.id))
    .filter(Boolean) as typeof content;

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <History className="w-6 h-6 text-green-400" />
        <h1 className="text-2xl font-bold">Watch History</h1>
        <span className="text-sm text-muted-foreground">({items.length} items)</span>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
          {items.map((item, i) => (
            <ContentCard
              key={item.id}
              item={item}
              index={i}
              onFavorite={toggleFavorite}
              onWatchlist={toggleWatchlist}
              isFavorite={favorites.includes(item.id)}
              isInWatchlist={watchlist.includes(item.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No watch history yet</h3>
          <p className="text-muted-foreground">Content you watch will appear here</p>
        </div>
      )}
    </div>
  );
}
