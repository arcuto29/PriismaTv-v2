"use client";
import { useMemo } from "react";
import { ContentItem } from "@/data/content";
import { ContentRow } from "./content-row";

interface SeasonalPicksProps {
  content: ContentItem[];
  favorites: string[];
  watchlist: string[];
  onFavorite: (id: string) => void;
  onWatchlist: (id: string) => void;
}

function getSeasonalConfig() {
  const month = new Date().getMonth(); // 0-11

  // October - Halloween
  if (month === 9) return {
    title: "🎃 Halloween Picks",
    icon: null,
    genres: ["horror", "thriller"],
    keywords: ["horror", "scary", "haunted", "ghost", "demon", "evil", "dead", "blood", "dark", "night", "kill", "fear", "terror", "curse", "witch", "zombie", "vampire", "monster"],
  };

  // November - Thanksgiving / Family
  if (month === 10) return {
    title: "🦃 Family Favorites",
    icon: null,
    genres: ["comedy", "animation", "adventure", "fantasy"],
    keywords: ["family", "friend", "love", "together", "home", "journey", "adventure", "magic", "hero"],
  };

  // December - Christmas / Winter
  if (month === 11) return {
    title: "🎄 Holiday Season Picks",
    icon: null,
    genres: ["comedy", "animation", "fantasy", "romance", "drama"],
    keywords: ["christmas", "holiday", "winter", "snow", "home", "family", "love", "magic", "miracle", "gift"],
  };

  // January - New Year / Fresh Starts
  if (month === 0) return {
    title: "🎆 New Year, New Watchlist",
    icon: null,
    genres: ["action", "sci-fi", "adventure"],
    keywords: ["new", "begin", "future", "world", "rise", "power", "hero", "destiny"],
  };

  // February - Valentine's
  if (month === 1) return {
    title: "💝 Valentine's Picks",
    icon: null,
    genres: ["romance", "comedy", "drama"],
    keywords: ["love", "heart", "romance", "relationship", "marry", "kiss", "together", "passion", "beautiful"],
  };

  // March-April - Spring / Action
  if (month === 2 || month === 3) return {
    title: "🌸 Spring Action",
    icon: null,
    genres: ["action", "adventure", "sci-fi"],
    keywords: ["fight", "battle", "war", "hero", "power", "mission", "save", "world", "team"],
  };

  // May - Summer Blockbusters start
  if (month === 4) return {
    title: "☀️ Summer Blockbuster Season",
    icon: null,
    genres: ["action", "sci-fi", "adventure", "animation"],
    keywords: ["epic", "world", "universe", "power", "hero", "battle", "ultimate", "destroy", "save"],
  };

  // June-July - Peak Summer
  if (month === 5 || month === 6) return {
    title: "🔥 Hot Summer Watches",
    icon: null,
    genres: ["action", "comedy", "adventure", "sci-fi"],
    keywords: ["fun", "adventure", "team", "mission", "fast", "wild", "epic", "ultimate"],
  };

  // August-September - Back to School / Anime Season
  if (month === 7 || month === 8) return {
    title: "⚔️ Anime Season",
    icon: null,
    genres: ["action", "adventure", "fantasy"],
    keywords: ["power", "fight", "school", "train", "demon", "hero", "warrior", "master", "level"],
    preferAnime: true,
  };

  return null;
}

export function SeasonalPicks({ content, favorites, watchlist, onFavorite, onWatchlist }: SeasonalPicksProps) {
  const config = getSeasonalConfig();

  const items = useMemo(() => {
    if (!config) return [];

    let results = content.filter((item) => {
      // Match by genre
      if (config.genres.includes(item.genre)) return true;
      // Match by keywords in description or title
      const text = `${item.title} ${item.description}`.toLowerCase();
      return config.keywords.some((kw) => text.includes(kw));
    });

    // Prefer anime if configured
    if ((config as { preferAnime?: boolean }).preferAnime) {
      const animeItems = results.filter((i) => i.type === "anime");
      if (animeItems.length >= 10) results = animeItems;
    }

    // Sort by rating and take top 20
    return results
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 20);
  }, [content, config]);

  if (!config || items.length === 0) return null;

  return (
    <ContentRow
      title={config.title}
      items={items}
      onFavorite={onFavorite}
      onWatchlist={onWatchlist}
      favorites={favorites}
      watchlist={watchlist}
    />
  );
}
