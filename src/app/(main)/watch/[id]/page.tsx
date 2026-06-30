"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Bookmark, Heart, Star, Clock,
  Film, ChevronLeft, Trash2, X, Video, Maximize, Edit3, Save, Wand2
} from "lucide-react";
import { useContentStore } from "@/hooks/use-content-store";
import { useRatings } from "@/hooks/use-ratings";
import { ContentItem, OWNER_PASSWORD, TMDB_API_KEY } from "@/data/content";
import { StarRating } from "@/components/features/star-rating";
import { cn } from "@/lib/utils";

const MY_SERVER_URL = "https://stream.priismatv.xyz";

function getServers(imdbId: string, tmdbId: string, type: string, season = 1, episode = 1) {
  if (type === "movie") {
    return [
      { name: "VidSrc", url: `https://vidsrc.me/embed/movie?imdb=${imdbId}` },
      { name: "VidSrc Pro", url: `https://vidsrc.pro/embed/movie/${imdbId}` },
      { name: "Embed.su", url: `https://embed.su/embed/movie/${imdbId}` },
      { name: "AutoEmbed", url: `https://autoembed.co/movie/imdb/${imdbId}` },
      { name: "MoviesAPI", url: `https://moviesapi.to/movie/${imdbId}` },
      { name: "NontonGo", url: `https://www.nontongo.win/embed/movie/${imdbId}` },
    ];
  }
  return [
    { name: "VidSrc", url: `https://vidsrc.me/embed/tv?imdb=${imdbId}&season=${season}&episode=${episode}` },
    { name: "VidSrc Pro", url: `https://vidsrc.pro/embed/tv/${imdbId}/${season}/${episode}` },
    { name: "Embed.su", url: `https://embed.su/embed/tv/${imdbId}/${season}/${episode}` },
    { name: "AutoEmbed", url: `https://autoembed.co/tv/imdb/${imdbId}-${season}-${episode}` },
    { name: "MoviesAPI", url: `https://moviesapi.to/tv/${imdbId}-${season}-${episode}` },
    { name: "NontonGo", url: `https://www.nontongo.win/embed/tv/${imdbId}/${season}/${episode}` },
  ];
}

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const { getContentById, toggleFavorite, toggleWatchlist, addToHistory, favorites, watchlist, removeContent, updateContent } = useContentStore();
  const { getRating, rateContent } = useRatings();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [imdbId, setImdbId] = useState<string | null>(null);
  const [tmdbId, setTmdbId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [audioPref, setAudioPref] = useState<"sub" | "dub">("sub");
  const [myServerFile, setMyServerFile] = useState<string | null>(null);

  // Auto-select my server when match found
  useEffect(() => {
    if (myServerFile) setSelectedServer(-2);
  }, [myServerFile]);
  const trailerRef = useRef<HTMLDivElement>(null);
  const [editForm, setEditForm] = useState({
    title: "", poster: "", backdrop: "", video: "", trailer: "",
    description: "", year: "", rating: "", genre: "", duration: "",
    episodes: "", seasons: "",
  });

  useEffect(() => {
    const found = getContentById(params.id as string);
    if (found) {
      setItem(found);
      addToHistory(found.id);
    }
  }, [params.id, getContentById, addToHistory]);

  // Auto-match file from my server
  useEffect(() => {
    if (!item) return;
    const matchFile = async () => {
      try {
        const res = await fetch(`${MY_SERVER_URL}/list`);
        const files: string[] = await res.json();
        
        // Try to find a matching file by title keywords + year
        const stopWords = ["the", "and", "of", "in", "to", "a", "an", "is", "it", "for"];
        const titleWords = item.title.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(" ").filter(w => w.length > 2 && !stopWords.includes(w));
        const yearStr = String(item.year);
        
        // For TV shows/anime — also match by season/episode
        const isShow = item.type === "tvshow" || item.type === "anime";
        const seasonStr = `s${String(selectedSeason).padStart(2, "0")}`;
        const episodeStr = `e${String(selectedEpisode).padStart(2, "0")}`;
        const sePattern = `${seasonStr}${episodeStr}`.toLowerCase();

        // First try: match title + year (most accurate)
        let match = files.find((file) => {
          const fileLower = file.toLowerCase();
          const matchCount = titleWords.filter(word => fileLower.includes(word)).length;
          const titleMatch = matchCount === titleWords.length; // ALL words must match
          const yearMatch = fileLower.includes(yearStr);
          
          if (isShow) {
            return titleMatch && fileLower.includes(sePattern);
          }
          return titleMatch && yearMatch;
        });

        // Second try: match title + year without episode (for shows)
        if (!match && !isShow) {
          match = files.find((file) => {
            const fileLower = file.toLowerCase();
            const matchCount = titleWords.filter(word => fileLower.includes(word)).length;
            const titleMatch = matchCount === titleWords.length;
            return titleMatch;
          });
        }

        // Third try: match all words but without year (less strict)
        if (!match) {
          match = files.find((file) => {
            const fileLower = file.toLowerCase();
            const matchCount = titleWords.filter(word => fileLower.includes(word)).length;
            const titleMatch = matchCount === titleWords.length;
            if (isShow) {
              return titleMatch && fileLower.includes(sePattern);
            }
            return titleMatch;
          });
        }

        if (match) {
          setMyServerFile(`${MY_SERVER_URL}/${encodeURIComponent(match)}`);
        } else {
          setMyServerFile(null);
        }
      } catch {
        setMyServerFile(null);
      }
    };
    matchFile();
  }, [item, selectedSeason, selectedEpisode]);

  // Auto-fetch TMDB/IMDB IDs when item loads
  const fetchIds = useCallback(async () => {
    if (!item) return;
    
    // Check if already cached on the item
    if ((item as unknown as Record<string, string>).imdbId) {
      setImdbId((item as unknown as Record<string, string>).imdbId);
      setTmdbId((item as unknown as Record<string, string>).tmdbId || null);
      return;
    }

    setLoading(true);
    try {
      const searchType = item.type === "movie" ? "movie" : "tv";
      const searchRes = await fetch(
        `https://api.themoviedb.org/3/search/${searchType}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(item.title)}&year=${item.year || ""}`
      );
      const searchData = await searchRes.json();

      if (searchData.results && searchData.results.length > 0) {
        const tmdb = searchData.results[0].id;
        setTmdbId(String(tmdb));

        const idsRes = await fetch(
          `https://api.themoviedb.org/3/${searchType}/${tmdb}/external_ids?api_key=${TMDB_API_KEY}`
        );
        const idsData = await idsRes.json();
        const imdb = idsData.imdb_id;

        if (imdb) {
          setImdbId(imdb);
          // Cache it on the item for next time
          updateContent(item.id, { ...item, imdbId: imdb, tmdbId: String(tmdb) } as unknown as Partial<ContentItem>);
        }
      }
    } catch (e) {
      console.error("Failed to fetch IDs:", e);
    }
    setLoading(false);
  }, [item, updateContent]);

  useEffect(() => {
    if (item && !imdbId) fetchIds();
  }, [item, imdbId, fetchIds]);

  // Fullscreen trailer
  const openTrailerFullscreen = () => {
    setShowTrailer(true);
    setTimeout(() => {
      if (trailerRef.current) {
        const el = trailerRef.current;
        if (el.requestFullscreen) el.requestFullscreen();
        else if ((el as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen) (el as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
      }
    }, 300);
  };

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Content not found</p>
          <button onClick={() => router.back()} className="text-primary hover:underline">Go back</button>
        </div>
      </div>
    );
  }

  const isFav = favorites.includes(item.id);
  const isInWatchlist = watchlist.includes(item.id);

  const handleDelete = () => {
    if (sessionStorage.getItem("priismatv_owner") !== "true") {
      const pw = prompt("Owner password required:");
      if (pw !== OWNER_PASSWORD) return;
      sessionStorage.setItem("priismatv_owner", "true");
    }
    if (confirm("Delete this content?")) {
      removeContent(item.id);
      router.push("/home");
    }
  };

  const servers = imdbId ? getServers(imdbId, tmdbId || "", item.type === "movie" ? "movie" : "tv", selectedSeason, selectedEpisode) : [];

  const getPlayerUrl = () => {
    if (selectedServer === -2 && myServerFile) return myServerFile;
    if (selectedServer === -1 && item.video) return item.video;
    if (servers[selectedServer]) return servers[selectedServer].url;
    return "";
  };

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="fixed top-20 left-4 lg:left-[260px] z-20 p-2 rounded-lg glass hover:bg-muted transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Trailer Fullscreen Modal */}
      <AnimatePresence>
        {showTrailer && item.trailer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTrailer(false)}
              className="fixed inset-0 bg-black/90 z-50"
            />
            <motion.div
              ref={trailerRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            >
              <button
                onClick={() => { setShowTrailer(false); if (document.fullscreenElement) document.exitFullscreen(); }}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${item.trailer}?autoplay=1&rel=0&modestbranding=1&vq=hd1080`}
                className="w-full h-full border-0"
                allowFullScreen
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <div className="relative h-[50vh] lg:h-[60vh] w-full overflow-hidden">
        {item.backdrop ? (
          <img src={item.backdrop} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-card to-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      </div>

      {/* Content Details */}
      <div className="relative -mt-48 lg:-mt-64 z-10 px-4 lg:px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row gap-8 max-w-6xl"
        >
          {/* Poster */}
          <div className="hidden lg:block flex-shrink-0 w-[240px]">
            <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              {item.poster ? (
                <img src={item.poster || ""} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Film className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl lg:text-5xl font-black mb-3">{item.title}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              {item.rating && (
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  <Star className="w-4 h-4 fill-yellow-400" /> {item.rating}
                </span>
              )}
              <span>{item.year}</span>
              <span className="capitalize px-2 py-0.5 rounded bg-muted text-xs">{item.genre}</span>
              {item.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.duration}</span>}
              {item.seasons && <span>{item.seasons} Seasons</span>}
              {item.episodes && <span>{item.episodes} Episodes</span>}
            </div>

            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed mb-6 max-w-2xl">
              {item.description}
            </p>

            {/* Your Rating */}
            <div className="mb-6 flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Your Rating:</span>
              <StarRating rating={getRating(item.id)} onRate={(r) => rateContent(item.id, r)} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <button
                onClick={() => { if (!imdbId && !item.video) { fetchIds(); } setIsPlaying(true); }}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> Finding stream...</>
                ) : (
                  <><Play className="w-5 h-5 fill-current" /> Watch Now</>
                )}
              </button>

              {item.trailer && (
                <button
                  onClick={openTrailerFullscreen}
                  className="flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-all border border-white/10"
                >
                  <Maximize className="w-4 h-4" /> Trailer
                </button>
              )}

              <button
                onClick={() => toggleWatchlist(item.id)}
                className={cn(
                  "p-3 rounded-lg transition-all border",
                  isInWatchlist ? "bg-primary/20 border-primary text-primary" : "bg-white/10 border-white/10 text-white hover:bg-white/20"
                )}
              >
                <Bookmark className={cn("w-5 h-5", isInWatchlist && "fill-current")} />
              </button>

              <button
                onClick={() => toggleFavorite(item.id)}
                className={cn(
                  "p-3 rounded-lg transition-all border",
                  isFav ? "bg-red-500/20 border-red-500 text-red-500" : "bg-white/10 border-white/10 text-white hover:bg-white/20"
                )}
              >
                <Heart className={cn("w-5 h-5", isFav && "fill-current")} />
              </button>

              <button onClick={handleDelete} className="p-3 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-red-500/20 hover:border-red-500 hover:text-red-500 transition-all">
                <Trash2 className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  if (sessionStorage.getItem("priismatv_owner") === "true") {
                    setShowEdit(!showEdit);
                    if (!showEdit) setEditForm({
                      title: item.title, poster: item.poster || "", backdrop: item.backdrop || "",
                      video: item.video || "", trailer: item.trailer || "", description: item.description,
                      year: String(item.year), rating: String(item.rating || ""), genre: item.genre,
                      duration: item.duration || "", episodes: String(item.episodes || ""), seasons: String(item.seasons || ""),
                    });
                  }
                }}
                className="p-3 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-primary/20 hover:border-primary hover:text-primary transition-all"
              >
                <Edit3 className="w-5 h-5" />
              </button>
            </div>

            {/* Edit Panel */}
            <AnimatePresence>
              {showEdit && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="p-5 rounded-xl bg-card border border-primary/20 space-y-3">
                    <h4 className="text-sm font-bold text-primary flex items-center gap-2"><Edit3 className="w-4 h-4" /> Edit Content</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Title</label>
                        <input type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Year</label>
                        <input type="number" value={editForm.year} onChange={(e) => setEditForm({...editForm, year: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Poster URL</label>
                      <input type="url" value={editForm.poster} onChange={(e) => setEditForm({...editForm, poster: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Backdrop URL</label>
                      <input type="url" value={editForm.backdrop} onChange={(e) => setEditForm({...editForm, backdrop: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Video/Stream URL</label>
                        <input type="url" value={editForm.video} onChange={(e) => setEditForm({...editForm, video: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Trailer (YouTube ID)</label>
                        <input type="text" value={editForm.trailer} onChange={(e) => setEditForm({...editForm, trailer: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Description</label>
                      <textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Rating</label>
                        <input type="text" value={editForm.rating} onChange={(e) => setEditForm({...editForm, rating: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Genre</label>
                        <input type="text" value={editForm.genre} onChange={(e) => setEditForm({...editForm, genre: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Duration</label>
                        <input type="text" value={editForm.duration} onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Seasons</label>
                        <input type="number" value={editForm.seasons} onChange={(e) => setEditForm({...editForm, seasons: e.target.value})}
                          className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          updateContent(item.id, {
                            title: editForm.title, poster: editForm.poster || null, backdrop: editForm.backdrop || null,
                            video: editForm.video || null, trailer: editForm.trailer || null, description: editForm.description,
                            year: parseInt(editForm.year) || item.year, rating: parseFloat(editForm.rating) || null,
                            genre: editForm.genre, duration: editForm.duration || null,
                            episodes: parseInt(editForm.episodes) || undefined, seasons: parseInt(editForm.seasons) || undefined,
                          });
                          setItem({...item, title: editForm.title, poster: editForm.poster || null, backdrop: editForm.backdrop || null,
                            video: editForm.video || null, trailer: editForm.trailer || null, description: editForm.description,
                            year: parseInt(editForm.year) || item.year, rating: parseFloat(editForm.rating) || null,
                            genre: editForm.genre, duration: editForm.duration || null,
                            episodes: parseInt(editForm.episodes) || undefined, seasons: parseInt(editForm.seasons) || undefined});
                          setShowEdit(false);
                        }}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 flex items-center gap-1"
                      >
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                      <button onClick={() => setShowEdit(false)} className="px-4 py-2 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80">
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Season/Episode Selector */}
            {(item.type === "tvshow" || item.type === "anime") && item.seasons && item.seasons > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Select Season & Episode</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {Array.from({ length: item.seasons }, (_, i) => i + 1).map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSeason(s); setSelectedEpisode(1); }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        selectedSeason === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      Season {s}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {Array.from({ length: Math.min(item.episodes ? Math.ceil(item.episodes / (item.seasons || 1)) : 12, 26) }, (_, i) => i + 1).map((ep) => (
                    <button
                      key={ep}
                      onClick={() => { setSelectedEpisode(ep); setIsPlaying(true); }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        selectedEpisode === ep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      Ep {ep}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Server Selection & Player */}
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                {!imdbId && !item.video && !loading && (
                  <div className="p-4 rounded-xl bg-muted border border-border text-center">
                    <p className="text-sm text-muted-foreground mb-3">Could not find streaming source for this title.</p>
                    <button onClick={fetchIds} className="text-sm text-primary hover:underline">Try again</button>
                  </div>
                )}

                {(imdbId || item.video) && (
                  <>
                    {/* Sub/Dub Toggle for Anime */}
                    {item.type === "anime" && (
                      <div className="mb-4 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium">Audio:</span>
                        <div className="flex rounded-lg overflow-hidden border border-border">
                          <button
                            onClick={() => setAudioPref("sub")}
                            className={cn(
                              "px-4 py-2 text-xs font-bold transition-all",
                              audioPref === "sub" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                          >
                            🇯🇵 SUB (Japanese)
                          </button>
                          <button
                            onClick={() => setAudioPref("dub")}
                            className={cn(
                              "px-4 py-2 text-xs font-bold transition-all",
                              audioPref === "dub" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                          >
                            🇺🇸 DUB (English)
                          </button>
                        </div>
                        <span className="text-[10px] text-muted-foreground ml-2">
                          {audioPref === "sub" ? "Original Japanese with subtitles" : "English dubbed audio"}
                        </span>
                      </div>
                    )}

                    <h3 className="text-sm font-semibold mb-3">Select Server</h3>
                    <p className="text-xs text-muted-foreground mb-3">If one server doesn&apos;t work, try another one.</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {myServerFile && (
                        <button
                          onClick={() => setSelectedServer(-2)}
                          className={cn(
                            "px-4 py-2 rounded-lg text-xs font-medium transition-all",
                            selectedServer === -2 ? "bg-green-500 text-white glow-cyan" : "bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                          )}
                        >
                          ⚡ My Server (HD)
                        </button>
                      )}
                      {servers.map((server, i) => (
                        <button
                          key={server.name}
                          onClick={() => setSelectedServer(i)}
                          className={cn(
                            "px-4 py-2 rounded-lg text-xs font-medium transition-all",
                            selectedServer === i ? "bg-primary text-primary-foreground glow-cyan" : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          {server.name}
                        </button>
                      ))}
                      {item.video && (
                        <button
                          onClick={() => setSelectedServer(-1)}
                          className={cn(
                            "px-4 py-2 rounded-lg text-xs font-medium transition-all",
                            selectedServer === -1 ? "bg-primary text-primary-foreground glow-cyan" : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          Direct Link
                        </button>
                      )}
                    </div>

                    {/* Player */}
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/10 shadow-2xl">
                      {selectedServer === -2 && myServerFile ? (
                        <video
                          key={myServerFile}
                          src={myServerFile}
                          controls
                          autoPlay
                          className="w-full h-full"
                          style={{ background: "#000" }}
                        />
                      ) : (
                        <iframe
                          key={`${selectedServer}-${selectedSeason}-${selectedEpisode}-${imdbId}`}
                          src={getPlayerUrl()}
                          className="w-full h-full border-0"
                          allowFullScreen
                          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                        />
                      )}
                    </div>

                    <p className="text-[11px] text-muted-foreground mt-3">
                      Use an ad blocker (uBlock Origin) for the best experience. If a server doesn&apos;t load, switch to another.
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
