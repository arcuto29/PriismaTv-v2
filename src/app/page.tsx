"use client";
import { Flame, Clock, Star, Sword, Film, Tv } from "lucide-react";
import { useContentStore } from "@/hooks/use-content-store";
import { HeroSection } from "@/components/content/hero-section";
import { ContentRow } from "@/components/content/content-row";

export default function HomePage() {
  const {
    trending, recentlyAdded, topRated, anime, movies, tvshows,
    favorites, watchlist, toggleFavorite, toggleWatchlist, isLoaded,
  } = useContentStore();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-12">
      <HeroSection
        items={trending.filter((i) => i.backdrop)}
        onWatchlist={toggleWatchlist}
      />

      <div className="-mt-16 relative z-10">
        <ContentRow
          title="Trending Now"
          icon={<Flame className="w-5 h-5 text-orange-400" />}
          items={trending.slice(0, 20)}
          seeAllHref="/movies"
          onFavorite={toggleFavorite}
          onWatchlist={toggleWatchlist}
          favorites={favorites}
          watchlist={watchlist}
        />

        <ContentRow
          title="Recently Added"
          icon={<Clock className="w-5 h-5 text-green-400" />}
          items={recentlyAdded}
          onFavorite={toggleFavorite}
          onWatchlist={toggleWatchlist}
          favorites={favorites}
          watchlist={watchlist}
        />

        <ContentRow
          title="Top Rated"
          icon={<Star className="w-5 h-5 text-yellow-400" />}
          items={topRated.slice(0, 20)}
          onFavorite={toggleFavorite}
          onWatchlist={toggleWatchlist}
          favorites={favorites}
          watchlist={watchlist}
        />

        <ContentRow
          title="Anime Picks"
          icon={<Sword className="w-5 h-5 text-purple-400" />}
          items={anime.slice(0, 20)}
          seeAllHref="/anime"
          onFavorite={toggleFavorite}
          onWatchlist={toggleWatchlist}
          favorites={favorites}
          watchlist={watchlist}
        />

        <ContentRow
          title="Movies"
          icon={<Film className="w-5 h-5 text-blue-400" />}
          items={movies.slice(0, 20)}
          seeAllHref="/movies"
          onFavorite={toggleFavorite}
          onWatchlist={toggleWatchlist}
          favorites={favorites}
          watchlist={watchlist}
        />

        <ContentRow
          title="TV Shows"
          icon={<Tv className="w-5 h-5 text-cyan-400" />}
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
