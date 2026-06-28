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
  const [yearRange, setYearRange] = useState("all");
  const [ratingMin, setRatingMin] = useState("all");

  const filtered = useMemo(() => {
    let result = genre === "all" ? items : items.filter((i) => i.genre === genre);
    if (yearRange !== "all") {
      const [min, max] = yearRange.split("-").map(Number);
      result = result.filter((i) => i.year >= min && i.year <= max);
    }
    if (ratingMin !== "all") {
      result = result.filter((i) => (i.rating || 0) >= parseFloat(ratingMin));
    }
    switch (sort) {
      case "rating": return [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "title": return [...result].sort((a, b) => a.title.localeCompare(b.title));
      case "year": return [...result].sort((a, b) => b.year - a.year);
      default: return [...result].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    }
  }, [items, genre, sort, yearRange, ratingMin]);

  const randomPick = () => {
    if (filtered.length === 0) return;
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    window.location.href = `/watch/${random.id}`;
  };

  return (
    <div className="px-4 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          {icon}
          <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
          <span className="text-sm text-muted-foreground ml-2">({filtered.length})</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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
            value={yearRange}
            onChange={(e) => setYearRange(e.target.value)}
            className="px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">All Years</option>
            <option value="2024-2026">2024-2026</option>
            <option value="2020-2023">2020-2023</option>
            <option value="2010-2019">2010s</option>
            <option value="2000-2009">2000s</option>
            <option value="1900-1999">Pre-2000</option>
          </select>
          <select
            value={ratingMin}
            onChange={(e) => setRatingMin(e.target.value)}
            className="px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">Any Rating</option>
            <option value="8">8+ ★</option>
            <option value="7">7+ ★</option>
            <option value="6">6+ ★</option>
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
          <button
            onClick={randomPick}
            className="px-3 py-2 rounded-lg bg-primary/20 border border-primary/30 text-sm text-primary font-medium hover:bg-primary/30 transition-colors"
          >
            🎲 Random
          </button>
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
