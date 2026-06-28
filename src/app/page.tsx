"use client";
import { motion } from "framer-motion";
import { Flame, Clock, Star, Sword, Film, Tv, Sparkles } from "lucide-react";
import { useContentStore } from "@/hooks/use-content-store";
import { HeroSection } from "@/components/content/hero-section";
import { ContentRow } from "@/components/content/content-row";
import { Recommendations } from "@/components/content/recommendations";

export default function HomePage() {
  const {
    content, trending, recentlyAdded, topRated, anime, movies, tvshows,
    favorites, watchlist, history, toggleFavorite, toggleWatchlist, isLoaded,
  } = useContentStore();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium tracking-wide">Loading PriismaTv...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* Hero */}
      <HeroSection
        items={trending.filter((i) => i.backdrop)}
        onWatchlist={toggleWatchlist}
      />

      {/* Content Rows */}
      <div className="-mt-24 relative z-10 space-y-2">
        <ContentRow
          title="Trending Now"
          icon={<Flame className="w-4 h-4 text-orange-400" />}
          items={trending.slice(0, 20)}
          seeAllHref="/movies"
          onFavorite={toggleFavorite}
          onWatchlist={toggleWatchlist}
          favorites={favorites}
          watchlist={watchlist}
        />

        <Recommendations
          content={content}
          history={history}
          favorites={favorites}
          watchlist={watchlist}
          onFavorite={toggleFavorite}
          onWatchlist={toggleWatchlist}
        />

        <ContentRow
          title="Recently Added"
          icon={<Sparkles className="w-4 h-4 text-green-400" />}
          items={recentlyAdded}
          onFavorite={toggleFavorite}
          onWatchlist={toggleWatchlist}
          favorites={favorites}
          watchlist={watchlist}
        />

        <ContentRow
          title="Top Rated"
          icon={<Star className="w-4 h-4 text-yellow-400" />}
          items={topRated.slice(0, 20)}
          onFavorite={toggleFavorite}
          onWatchlist={toggleWatchlist}
          favorites={favorites}
          watchlist={watchlist}
        />

        <ContentRow
          title="Anime Collection"
          icon={<Sword className="w-4 h-4 text-purple-400" />}
          items={anime.slice(0, 20)}
          seeAllHref="/anime"
          onFavorite={toggleFavorite}
          onWatchlist={toggleWatchlist}
          favorites={favorites}
          watchlist={watchlist}
        />

        <ContentRow
          title="Movies"
          icon={<Film className="w-4 h-4 text-blue-400" />}
          items={movies.slice(0, 20)}
          seeAllHref="/movies"
          onFavorite={toggleFavorite}
          onWatchlist={toggleWatchlist}
          favorites={favorites}
          watchlist={watchlist}
        />

        <ContentRow
          title="TV Shows"
          icon={<Tv className="w-4 h-4 text-cyan-400" />}
          items={tvshows.slice(0, 20)}
          seeAllHref="/tvshows"
          onFavorite={toggleFavorite}
          onWatchlist={toggleWatchlist}
          favorites={favorites}
          watchlist={watchlist}
        />
      </div>
    </div>
  );
}
