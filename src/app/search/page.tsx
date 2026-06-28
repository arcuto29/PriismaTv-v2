"use client";
import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";
import { Search } from "lucide-react";
import { useContentStore } from "@/hooks/use-content-store";
import { ContentCard } from "@/components/content/content-card";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { content, favorites, watchlist, toggleFavorite, toggleWatchlist } = useContentStore();

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return content.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.genre.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q)
    );
  }, [content, query]);

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        {query && <span className="text-sm text-muted-foreground">({results.length} found)</span>}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
          {results.map((item, i) => (
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
      ) : query ? (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No results found for &quot;{query}&quot;</p>
        </div>
      ) : (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Type something to search...</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
