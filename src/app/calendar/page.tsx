"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Plus, X, Clock, Loader2, RefreshCw } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { STORAGE_KEYS, TMDB_API_KEY } from "@/data/content";

interface CountdownItem {
  id: string;
  title: string;
  date: string;
  type: "anime" | "movie" | "tvshow";
  poster?: string;
  overview?: string;
}

export default function CalendarPage() {
  const [countdowns, setCountdowns] = useLocalStorage<CountdownItem[]>(STORAGE_KEYS.COUNTDOWN, []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", type: "anime" as CountdownItem["type"] });
  const [upcoming, setUpcoming] = useState<CountdownItem[]>([]);
  const [loadingUpcoming, setLoadingUpcoming] = useState(false);

  // Fetch upcoming releases from TMDB
  const fetchUpcoming = async () => {
    setLoadingUpcoming(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const future = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      // Fetch upcoming movies
      const moviesRes = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&primary_release_date.gte=${today}&primary_release_date.lte=${future}&sort_by=primary_release_date.asc&with_genres=28,878,14,16&page=1`
      );
      const moviesData = await moviesRes.json();

      // Fetch upcoming TV/Anime
      const tvRes = await fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB_API_KEY}&first_air_date.gte=${today}&first_air_date.lte=${future}&sort_by=first_air_date.asc&with_genres=16&page=1`
      );
      const tvData = await tvRes.json();

      // Fetch upcoming anime movies
      const animeMoviesRes = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&primary_release_date.gte=${today}&primary_release_date.lte=${future}&sort_by=primary_release_date.asc&with_genres=16&with_original_language=ja&page=1`
      );
      const animeMoviesData = await animeMoviesRes.json();

      const items: CountdownItem[] = [];

      // Process anime movies (Japanese animated)
      if (animeMoviesData.results) {
        animeMoviesData.results.slice(0, 8).forEach((r: { id: number; title: string; release_date: string; poster_path: string; overview: string }) => {
          items.push({
            id: `tmdb-am-${r.id}`,
            title: r.title,
            date: r.release_date,
            type: "anime",
            poster: r.poster_path ? `https://image.tmdb.org/t/p/w200${r.poster_path}` : undefined,
            overview: r.overview,
          });
        });
      }

      // Process upcoming anime TV
      if (tvData.results) {
        tvData.results.slice(0, 8).forEach((r: { id: number; name: string; first_air_date: string; poster_path: string; overview: string }) => {
          items.push({
            id: `tmdb-tv-${r.id}`,
            title: r.name,
            date: r.first_air_date,
            type: "anime",
            poster: r.poster_path ? `https://image.tmdb.org/t/p/w200${r.poster_path}` : undefined,
            overview: r.overview,
          });
        });
      }

      // Process upcoming movies (action/sci-fi/fantasy)
      if (moviesData.results) {
        moviesData.results.slice(0, 8).forEach((r: { id: number; title: string; release_date: string; poster_path: string; overview: string }) => {
          if (!items.find((i) => i.title === r.title)) {
            items.push({
              id: `tmdb-m-${r.id}`,
              title: r.title,
              date: r.release_date,
              type: "movie",
              poster: r.poster_path ? `https://image.tmdb.org/t/p/w200${r.poster_path}` : undefined,
              overview: r.overview,
            });
          }
        });
      }

      // Sort by date
      items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setUpcoming(items);
    } catch (e) {
      console.error("Failed to fetch upcoming:", e);
    }
    setLoadingUpcoming(false);
  };

  useEffect(() => {
    fetchUpcoming();
  }, []);

  const addCountdown = () => {
    if (!form.title || !form.date) return;
    setCountdowns([...countdowns, { id: Date.now().toString(), ...form }]);
    setForm({ title: "", date: "", type: "anime" });
    setShowForm(false);
  };

  const addFromUpcoming = (item: CountdownItem) => {
    if (countdowns.find((c) => c.title === item.title)) return;
    setCountdowns([...countdowns, item]);
  };

  const removeCountdown = (id: string) => {
    setCountdowns(countdowns.filter((c) => c.id !== id));
  };

  const getDaysUntil = (date: string) => {
    const diff = new Date(date).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-orange-400" />
          <h1 className="text-2xl font-bold">Release Calendar</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" /> Add Custom
        </button>
      </div>

      {showForm && (
        <div className="p-4 rounded-xl bg-card border border-border mb-6 max-w-md space-y-3">
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title..."
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CountdownItem["type"] })}
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="anime">Anime</option>
            <option value="movie">Movie</option>
            <option value="tvshow">TV Show</option>
          </select>
          <button onClick={addCountdown} className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Add Countdown</button>
        </div>
      )}

      {/* My Countdowns */}
      {countdowns.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4">My Countdowns</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {countdowns.sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date)).map((item) => {
              const days = getDaysUntil(item.date);
              const isToday = days === 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-xl border transition-all ${isToday ? "bg-primary/10 border-primary/30 glow-cyan" : "bg-card border-border"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      {item.poster && <img src={item.poster} alt="" className="w-12 h-16 rounded-lg object-cover flex-shrink-0" />}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-primary px-2 py-0.5 rounded bg-primary/20">{item.type}</span>
                        <h3 className="font-semibold mt-1 text-sm">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(item.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => removeCountdown(item.id)} className="p-1 text-muted-foreground hover:text-red-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className={`text-lg font-bold ${isToday ? "text-primary arise-glow" : ""}`}>
                      {isToday ? "OUT NOW! 🎉" : `${days} days`}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Releases from TMDB */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Upcoming Releases (Next 90 Days)</h2>
          <button onClick={fetchUpcoming} disabled={loadingUpcoming} className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50">
            <RefreshCw className={`w-3 h-3 ${loadingUpcoming ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {loadingUpcoming ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Fetching upcoming releases...</span>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((item) => {
              const days = getDaysUntil(item.date);
              const alreadyAdded = countdowns.find((c) => c.title === item.title);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-card border border-border hover:border-white/10 transition-all"
                >
                  <div className="flex gap-3">
                    {item.poster && <img src={item.poster} alt="" className="w-14 h-20 rounded-lg object-cover flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary">{item.type}</span>
                        <span className="text-[10px] text-muted-foreground">{days} days</span>
                      </div>
                      <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      {item.overview && (
                        <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{item.overview}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => addFromUpcoming(item)}
                    disabled={!!alreadyAdded}
                    className={`mt-3 w-full py-1.5 rounded-lg text-xs font-medium transition-all ${
                      alreadyAdded
                        ? "bg-muted text-muted-foreground cursor-default"
                        : "bg-primary/20 text-primary hover:bg-primary/30"
                    }`}
                  >
                    {alreadyAdded ? "✓ Added" : "+ Add to My Countdowns"}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loadingUpcoming && upcoming.length === 0 && (
          <p className="text-center text-muted-foreground py-10">No upcoming releases found. Try refreshing.</p>
        )}
      </div>
    </div>
  );
}
