"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Plus, Heart, Star, Info } from "lucide-react";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "content-card relative group rounded-xl overflow-hidden cursor-pointer",
        variant === "wide" ? "aspect-video" : "aspect-[2/3]",
        variant === "featured" && "aspect-[16/9] md:aspect-[2/3]"
      )}
    >
      <Link href={`/watch/${item.id}`}>
        {/* Poster Image */}
        <div className="absolute inset-0 bg-muted">
          {item.poster && !imageError ? (
            <Image
              src={item.poster}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-card">
              <Play className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Bottom gradient always visible for text */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Rating Badge */}
        {item.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white">{item.rating}</span>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary/90 text-[10px] font-bold uppercase text-primary-foreground">
          {item.type === "tvshow" ? "TV" : item.type}
        </div>
      </Link>

      {/* Hover Action Buttons */}
      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-2 px-3"
      >
        <Link
          href={`/watch/${item.id}`}
          className="p-2 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform"
        >
          <Play className="w-4 h-4 fill-current" />
        </Link>
        {onWatchlist && (
          <button
            onClick={(e) => { e.preventDefault(); onWatchlist(item.id); }}
            className={cn(
              "p-2 rounded-full transition-all hover:scale-110",
              isInWatchlist ? "bg-primary text-primary-foreground" : "bg-white/20 backdrop-blur-sm text-white"
            )}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
        {onFavorite && (
          <button
            onClick={(e) => { e.preventDefault(); onFavorite(item.id); }}
            className={cn(
              "p-2 rounded-full transition-all hover:scale-110",
              isFavorite ? "bg-red-500 text-white" : "bg-white/20 backdrop-blur-sm text-white"
            )}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </button>
        )}
      </motion.div>

      {/* Title & Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-300 mt-0.5">
          <span>{item.year}</span>
          {item.duration && <span>{item.duration}</span>}
          {item.episodes && <span>{item.episodes} ep</span>}
        </div>
      </div>
    </motion.div>
  );
}
