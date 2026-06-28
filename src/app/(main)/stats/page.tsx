"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Film, Sword, Tv, Star, Clock, TrendingUp, Heart, Bookmark } from "lucide-react";
import { useContentStore } from "@/hooks/use-content-store";

export default function StatsPage() {
  const { content, history, favorites, watchlist } = useContentStore();

  const stats = useMemo(() => {
    const movies = content.filter((i) => i.type === "movie");
    const anime = content.filter((i) => i.type === "anime");
    const tvshows = content.filter((i) => i.type === "tvshow");
    const avgRating = content.filter((i) => i.rating).reduce((sum, i) => sum + (i.rating || 0), 0) / content.filter((i) => i.rating).length;

    // Genre breakdown
    const genres: Record<string, number> = {};
    content.forEach((i) => { genres[i.genre] = (genres[i.genre] || 0) + 1; });
    const topGenres = Object.entries(genres).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Estimated watch time
    const estimatedHours = history.length * 2; // Rough estimate 2hrs per item

    return { movies, anime, tvshows, avgRating, topGenres, estimatedHours, totalItems: content.length };
  }, [content, history]);

  const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-card border border-border hover:border-white/10 transition-colors"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${color}`}>
        {icon}
      </div>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1">Watch Stats</h1>
        <p className="text-muted-foreground text-sm">Your streaming analytics at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Film className="w-5 h-5 text-white" />} label="Movies" value={stats.movies.length} color="from-blue-500 to-blue-700" />
        <StatCard icon={<Sword className="w-5 h-5 text-white" />} label="Anime" value={stats.anime.length} color="from-purple-500 to-purple-700" />
        <StatCard icon={<Tv className="w-5 h-5 text-white" />} label="TV Shows" value={stats.tvshows.length} color="from-cyan-500 to-cyan-700" />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-white" />} label="Total Library" value={stats.totalItems} color="from-green-500 to-green-700" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Star className="w-5 h-5 text-white" />} label="Avg Rating" value={stats.avgRating.toFixed(1)} color="from-yellow-500 to-orange-500" />
        <StatCard icon={<Clock className="w-5 h-5 text-white" />} label="Est. Hours Watched" value={`${stats.estimatedHours}h`} color="from-pink-500 to-red-500" />
        <StatCard icon={<Heart className="w-5 h-5 text-white" />} label="Favorites" value={favorites.length} color="from-red-500 to-pink-600" />
        <StatCard icon={<Bookmark className="w-5 h-5 text-white" />} label="Watchlist" value={watchlist.length} color="from-indigo-500 to-purple-600" />
      </div>

      {/* Top Genres */}
      <div className="p-6 rounded-2xl bg-card border border-border mb-8">
        <h3 className="font-bold mb-4">Top Genres</h3>
        <div className="space-y-3">
          {stats.topGenres.map(([genre, count], i) => (
            <div key={genre} className="flex items-center gap-3">
              <span className="text-sm font-medium capitalize w-24">{genre}</span>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / stats.totalItems) * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500"
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* History count */}
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="font-bold mb-2">Watch History</h3>
        <p className="text-3xl font-black text-primary">{history.length}</p>
        <p className="text-xs text-muted-foreground">items watched</p>
      </div>
    </div>
  );
}
