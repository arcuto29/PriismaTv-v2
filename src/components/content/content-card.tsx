"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Heart, Star, Check } from "lucide-react";
import { ContentItem } from "@/data/content";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  item: ContentItem;
  index?: number;
  variant?: "default" | "wide" | "featured";
  onFavorite?: (id: string) => void;
  onWatchlist?: (id: string) => void;
  isFavorite?: boolean;
  isInWatchlist?: boolean;
}

export function ContentCard({
  item, index = 0, variant = "default",
  onFavorite, onWatchlist, isFavorite, isInWatchlist,
}: ContentCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dominantColor, setDominantColor] = useState("rgba(229, 9, 20, 0.15)");
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Extract dominant color from poster for ambient glow
  useEffect(() => {
    if (!item.poster || imageError) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = item.poster;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        setDominantColor(`rgba(${r}, ${g}, ${b}, 0.2)`);
      } catch {
        // CORS or other error, use default
      }
    };
  }, [item.poster, imageError]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.04, 0.4), ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseMove={(e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.06) translateY(-12px)`;
      }}
      onMouseLeave={() => {
        if (cardRef.current) {
          cardRef.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1) translateY(0)";
        }
        setIsHovered(false);
      }}
      ref={cardRef}
      className={cn(
        "relative group rounded-xl overflow-hidden cursor-pointer ambient-glow",
        variant === "wide" ? "aspect-video" : "aspect-[2/3]",
      )}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 0.2s ease-out, box-shadow 0.5s ease",
        ["--card-glow" as string]: dominantColor,
      }}
    >
      <Link href={`/watch/${item.id}`} className="block w-full h-full">
        {/* Poster Image */}
        <div className="absolute inset-0 bg-[#08080d]">
          {item.poster && !imageError ? (
            <img
              ref={imgRef}
              src={item.poster}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#12121a] to-[#08080d]">
              <span className="text-4xl font-black text-white/5">{item.title[0]}</span>
            </div>
          )}
        </div>

        {/* Bottom gradient - always */}
        <div className="absolute bottom-0 left-0 right-0 h-[75%] bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        {/* Hover overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-[1]"
            />
          )}
        </AnimatePresence>

        {/* Top glow line on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              className="absolute top-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent z-[3] origin-center"
            />
          )}
        </AnimatePresence>

        {/* Rating Badge */}
        {item.rating && (
          <div className="absolute top-3 right-3 z-[2] flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-xl border border-white/[0.06] text-xs font-bold">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white">{item.rating}</span>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-3 left-3 z-[2] flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-md bg-primary/90 text-[9px] font-bold uppercase tracking-wider text-white">
            {item.type === "tvshow" ? "TV" : item.type}
          </span>
          {item.dateAdded && (Date.now() - new Date(item.dateAdded).getTime()) < 30 * 24 * 60 * 60 * 1000 && (
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/90 text-[8px] font-bold text-white uppercase">New</span>
          )}
        </div>
      </Link>

      {/* Hover Action Buttons */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="absolute bottom-16 left-0 right-0 z-[3] flex items-center justify-center gap-2.5 px-3"
          >
            <Link
              href={`/watch/${item.id}`}
              className="p-3 rounded-full bg-white text-black hover:scale-110 transition-all duration-200 shadow-[0_4px_20px_rgba(255,255,255,0.3)]"
            >
              <Play className="w-4 h-4 fill-black" />
            </Link>
            {onWatchlist && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWatchlist(item.id); }}
                className={cn(
                  "p-2.5 rounded-full transition-all duration-200 hover:scale-110 border",
                  isInWatchlist
                    ? "bg-primary border-primary text-white"
                    : "bg-black/60 backdrop-blur-xl border-white/15 text-white hover:border-white/30"
                )}
              >
                {isInWatchlist ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            )}
            {onFavorite && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavorite(item.id); }}
                className={cn(
                  "p-2.5 rounded-full transition-all duration-200 hover:scale-110 border",
                  isFavorite
                    ? "bg-rose-500 border-rose-500 text-white"
                    : "bg-black/60 backdrop-blur-xl border-white/15 text-white hover:border-white/30"
                )}
              >
                <Heart className={cn("w-3.5 h-3.5", isFavorite && "fill-current")} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title & Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5 z-[2]">
        <h3 className="text-[13px] font-semibold text-white truncate leading-tight">{item.title}</h3>
        <div className="flex items-center gap-2 text-[10px] text-white/40 mt-1.5 font-medium">
          <span>{item.year}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-white/20" />
          {item.duration && <span>{item.duration}</span>}
          {item.episodes && <span>{item.episodes} ep</span>}
          <span className="w-[3px] h-[3px] rounded-full bg-white/20" />
          <span className="capitalize">{item.genre}</span>
        </div>
      </div>
    </motion.div>
  );
}
