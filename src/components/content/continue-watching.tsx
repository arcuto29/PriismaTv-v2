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
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-8"
    >
      <div className="flex items-center gap-3 mb-6 px-4 lg:px-12">
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Clock className="w-4 h-4 text-emerald-400" />
        </div>
        <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white/90">Continue Watching</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto px-4 lg:px-12 scrollbar-hide pb-2">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href={`/watch/${item.id}`} className="flex-none w-[300px] sm:w-[350px] group block">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#08080d] border border-white/[0.03] hover:border-white/[0.08] transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                {item.backdrop ? (
                  <img src={item.backdrop} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                ) : item.poster ? (
                  <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#12121a] to-[#08080d] flex items-center justify-center">
                    <Play className="w-8 h-8 text-white/5" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Hover play */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-[0_8px_30px_rgba(229,9,20,0.4)]"
                  >
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </motion.div>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
                  <p className="text-[10px] text-white/40 mt-0.5 font-medium">
                    {item.type === "tvshow" || item.type === "anime" ? `S1 E1` : item.duration || ""}
                  </p>
                  {/* Premium progress bar */}
                  <div className="w-full h-[3px] rounded-full bg-white/10 mt-3 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-red-400 relative"
                      style={{ width: `${item.progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    </div>
                  </div>
                </div>

                {/* Time badge */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/[0.06] text-[9px] font-medium text-white/50">
                  {Math.floor((100 - item.progress) * 0.9)}m left
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
