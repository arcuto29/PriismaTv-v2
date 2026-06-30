"use client";
import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sword, Play, Clock } from "lucide-react";
import { useContentStore } from "@/hooks/use-content-store";
import { ContentGrid } from "@/components/content/content-grid";

export default function AnimePage() {
  const { anime, favorites, watchlist, toggleFavorite, toggleWatchlist, episodeProgress, isLoaded } = useContentStore();

  // Build the "Continue Watching" list from episode progress
  const continueAnime = useMemo(() => {
    return Object.entries(episodeProgress)
      .map(([id, prog]) => {
        const item = anime.find((a) => a.id === id);
        if (!item) return null;
        return { ...item, lastSeason: prog.season, lastEpisode: prog.episode, watchedAt: prog.timestamp };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b!.watchedAt).getTime() - new Date(a!.watchedAt).getTime())
      .slice(0, 15) as (typeof anime[0] & { lastSeason: number; lastEpisode: number; watchedAt: string })[];
  }, [anime, episodeProgress]);

  if (!isLoaded) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-2">
      {/* Continue Watching Anime */}
      {continueAnime.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-6"
        >
          <div className="flex items-center gap-3 mb-5 px-4 lg:px-12">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight">Resume Watching</h2>
          </div>

          <div className="flex gap-3 overflow-x-auto px-4 lg:px-12 scrollbar-hide pb-2">
            {continueAnime.map((item) => (
              <Link
                key={item.id}
                href={`/watch/${item.id}`}
                className="flex-none w-[280px] sm:w-[320px] group"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-card border border-border hover:border-purple-500/30 transition-all">
                  {item.backdrop ? (
                    <img src={item.backdrop} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : item.poster ? (
                    <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-muted to-card flex items-center justify-center">
                      <Play className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-purple-500/30 backdrop-blur-sm flex items-center justify-center border border-purple-400/40">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>

                  {/* Episode badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-purple-500/80 text-[10px] font-bold text-white">
                    S{item.lastSeason} E{item.lastEpisode}
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                    <p className="text-[10px] text-white/60 mt-0.5">
                      Season {item.lastSeason} &middot; Episode {item.lastEpisode}
                    </p>

                    {/* Progress bar (estimate based on episode/total) */}
                    <div className="w-full h-1 rounded-full bg-white/20 mt-2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{ width: `${item.episodes ? Math.min(((item.lastEpisode + (item.lastSeason - 1) * Math.ceil(item.episodes / (item.seasons || 1))) / item.episodes) * 100, 95) : 50}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      {/* Full Anime Grid */}
      <ContentGrid
        title="Anime"
        icon={<Sword className="w-6 h-6 text-purple-400" />}
        items={anime}
        onFavorite={toggleFavorite}
        onWatchlist={toggleWatchlist}
        favorites={favorites}
        watchlist={watchlist}
      />
    </div>
  );
}
