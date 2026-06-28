"use client";
import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Clock } from "lucide-react";
import { ContentItem } from "@/data/content";

interface ContinueWatchingProps {
  content: ContentItem[];
  history: { id: string; date: string }[];
}

export function ContinueWatching({ content, history }: ContinueWatchingProps) {
  const items = useMemo(() => {
    return history
      .slice(0, 10)
      .map((h) => {
        const item = content.find((c) => c.id === h.id);
        if (!item) return null;
        // Simulate random progress (in a real app this would be stored)
        const progress = Math.floor(Math.random() * 70) + 15;
        return { ...item, progress, watchedAt: h.date };
      })
      .filter(Boolean) as (ContentItem & { progress: number; watchedAt: string })[];
  }, [content, history]);

  if (items.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-6"
    >
      <div className="flex items-center gap-3 mb-5 px-4 lg:px-12">
        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
          <Clock className="w-4 h-4 text-green-400" />
        </div>
        <h2 className="text-xl lg:text-2xl font-bold tracking-tight">Continue Watching</h2>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 lg:px-12 scrollbar-hide pb-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/watch/${item.id}`}
            className="flex-none w-[280px] sm:w-[320px] group"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all">
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
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                <p className="text-[10px] text-white/60 mt-0.5">
                  {item.type === "tvshow" || item.type === "anime" ? `S1 E1` : item.duration || ""}
                </p>

                {/* Progress bar */}
                <div className="w-full h-1 rounded-full bg-white/20 mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
