"use client";
import { useState, useRef } from "react";
import Image from "next/image";
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
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.5), ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseMove={(e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        cardRef.current.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.05)`;
      }}
      onMouseLeave={() => {
        if (cardRef.current) {
          cardRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
        }
        setIsHovered(false);
      }}
      ref={cardRef}
      className={cn(
        "relative group rounded-xl overflow-hidden cursor-pointer shine-effect",
        "transition-shadow duration-500",
        "hover:z-20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(0,212,255,0.15)]",
        variant === "wide" ? "aspect-video" : "aspect-[2/3]",
      )}
      style={{ transformStyle: "preserve-3d", transition: "transform 0.15s ease-out, box-shadow 0.3s ease" }}
    >
      <Link href={`/watch/${item.id}`} className="block w-full h-full">
        {/* Poster Image */}
        <div className="absolute inset-0 bg-card">
          {item.poster && !imageError ? (
            <Image
              src={item.poster}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-card">
              <Play className="w-8 h-8 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Always visible bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Hover overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20 z-[1]"
            />
          )}
        </AnimatePresence>

        {/* Rating Badge - always visible */}
        {item.rating && (
          <div className="absolute top-2.5 right-2.5 z-[2] flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white">{item.rating}</span>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-2.5 left-2.5 z-[2] px-2 py-0.5 rounded bg-primary/90 backdrop-blur-sm text-[9px] font-black uppercase tracking-wider text-primary-foreground">
          {item.type === "tvshow" ? "TV" : item.type}
        </div>
      </Link>

      {/* Hover Action Buttons */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="absolute bottom-14 left-0 right-0 z-[3] flex items-center justify-center gap-2 px-3"
          >
            <Link
              href={`/watch/${item.id}`}
              className="p-2.5 rounded-full bg-white text-black hover:scale-110 transition-transform shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" />
            </Link>
            {onWatchlist && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWatchlist(item.id); }}
                className={cn(
                  "p-2.5 rounded-full transition-all hover:scale-110 border shadow-lg",
                  isInWatchlist 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : "bg-black/50 backdrop-blur-md border-white/20 text-white hover:border-white/40"
                )}
              >
                {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            )}
            {onFavorite && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavorite(item.id); }}
                className={cn(
                  "p-2.5 rounded-full transition-all hover:scale-110 border shadow-lg",
                  isFavorite 
                    ? "bg-red-500 border-red-500 text-white" 
                    : "bg-black/50 backdrop-blur-md border-white/20 text-white hover:border-white/40"
                )}
              >
                <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title & Info - always visible */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-[2]">
        <h3 className="text-sm font-bold text-white truncate leading-tight">{item.title}</h3>
        <div className="flex items-center gap-2 text-[11px] text-white/60 mt-1 font-medium">
          <span>{item.year}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-white/40" />
          {item.duration && <span>{item.duration}</span>}
          {item.episodes && <span>{item.episodes} ep</span>}
          <span className="w-0.5 h-0.5 rounded-full bg-white/40" />
          <span className="capitalize">{item.genre}</span>
        </div>
      </div>
    </motion.div>
  );
}
