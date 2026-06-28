"use client";
import { useState, useMemo } from "react";
import { ContentItem } from "@/data/content";
import { ContentCard } from "./content-card";

interface ContentGridProps {
  items: ContentItem[];
  title: string;
  icon?: React.ReactNode;
  onFavorite?: (id: string) => void;
  onWatchlist?: (id: string) => void;
  favorites?: string[];
  watchlist?: string[];
}

const GENRES = [
  "all", "action", "adventure", "comedy", "crime", "drama", "fantasy",
  "horror", "mecha", "romance", "sci-fi", "shonen", "slice-of-life", "thriller", "documentary", "animation"
];

export function ContentGrid({
  items, title, icon, onFavorite, onWatchlist, favorites = [], watchlist = [],
}: ContentGridProps) {
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    let result = genre === "all" ? items : items.filter((i) => i.genre === genre);
    switch (sort) {
      case "rating": return [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "title": return [...result].sort((a, b) => a.title.localeCompare(b.title));
      case "year": return [...result].sort((a, b) => b.year - a.year);
      default: return [...result].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    }
  }, [items, genre, sort]);

  return (
    <div className="px-4 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          {icon}
          <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
          <span className="text-sm text-muted-foreground ml-2">({filtered.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g === "all" ? "All Genres" : g.charAt(0).toUpperCase() + g.slice(1)}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="title">A-Z</option>
            <option value="year">By Year</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
        {filtered.map((item, i) => (
          <ContentCard
            key={item.id}
            item={item}
            index={i}
            onFavorite={onFavorite}
            onWatchlist={onWatchlist}
            isFavorite={favorites.includes(item.id)}
            isInWatchlist={watchlist.includes(item.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No content found for this filter.</p>
        </div>
      )}
    </div>
  );
}
