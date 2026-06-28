"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Play, Bookmark, Heart, Share2, Star, Clock,
  Film, ChevronLeft, ExternalLink, Trash2
} from "lucide-react";
import { useContentStore } from "@/hooks/use-content-store";
import { ContentItem, OWNER_PASSWORD } from "@/data/content";
import { cn } from "@/lib/utils";

const STREAMING_SERVERS = [
  { id: "vidsrc", name: "VidSrc", getUrl: (id: string, type: string) => `https://vidsrc.xyz/embed/${type}/${id}` },
  { id: "vidsrc2", name: "VidSrc 2", getUrl: (id: string, type: string) => `https://vidsrc.to/embed/${type}/${id}` },
  { id: "embed", name: "2Embed", getUrl: (id: string, type: string) => `https://www.2embed.cc/embed/${id}` },
  { id: "smashystream", name: "Smashy", getUrl: (id: string, type: string) => `https://player.smashy.stream/${type}/${id}` },
];

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const { getContentById, toggleFavorite, toggleWatchlist, addToHistory, favorites, watchlist, removeContent } = useContentStore();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedServer, setSelectedServer] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  useEffect(() => {
    const found = getContentById(params.id as string);
    if (found) {
      setItem(found);
      addToHistory(found.id);
    }
  }, [params.id, getContentById, addToHistory]);

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
    const pw = prompt("Owner password required:");
    if (pw === OWNER_PASSWORD) {
      removeContent(item.id);
      router.push("/");
    }
  };

  const getStreamUrl = () => {
    if (item.video) return item.video;
    return null;
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

      {/* Backdrop */}
      <div className="relative h-[50vh] lg:h-[60vh] w-full overflow-hidden">
        {item.backdrop ? (
          <Image src={item.backdrop} alt={item.title} fill className="object-cover" priority sizes="100vw" />
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
                <Image src={item.poster} alt={item.title} width={240} height={360} className="object-cover w-full h-full" />
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

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <button
                onClick={() => setIsPlaying(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" /> Watch Now
              </button>

              {item.trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${item.trailer}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-all border border-white/10"
                >
                  <ExternalLink className="w-4 h-4" /> Trailer
                </a>
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
            </div>

            {/* Season/Episode Selector */}
            {item.seasons && item.seasons > 0 && (
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
                      S{s}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: Math.min(item.episodes ? Math.ceil(item.episodes / (item.seasons || 1)) : 12, 24) }, (_, i) => i + 1).map((ep) => (
                    <button
                      key={ep}
                      onClick={() => setSelectedEpisode(ep)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        selectedEpisode === ep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      E{ep}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Server Selection */}
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h3 className="text-sm font-semibold mb-3">Select Server</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {STREAMING_SERVERS.map((server, i) => (
                    <button
                      key={server.id}
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
                <div className="w-full aspect-video rounded-xl overflow-hidden bg-black ring-1 ring-white/10">
                  <iframe
                    src={selectedServer === -1 && item.video ? item.video : STREAMING_SERVERS[selectedServer]?.getUrl(item.id, item.type === "movie" ? "movie" : "tv") || ""}
                    className="w-full h-full border-0"
                    allowFullScreen
                    allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
