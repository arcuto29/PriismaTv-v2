"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star, Clock, Bookmark } from "lucide-react";
import { ContentItem } from "@/data/content";

interface HeroSectionProps {
  items: ContentItem[];
  onWatchlist?: (id: string) => void;
}

export function HeroSection({ items, onWatchlist }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featured = items.slice(0, 5);
  const current = featured[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (!current) return null;

  return (
    <section className="relative h-[70vh] lg:h-[80vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {current.backdrop ? (
            <Image
              src={current.backdrop}
              alt={current.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-card to-muted" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />

      {/* Content */}
      <div className="relative h-full flex items-end pb-16 lg:pb-24 px-4 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl"
          >
            {/* Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30">
                Featured
              </span>
              {current.rating && (
                <span className="flex items-center gap-1 text-sm text-yellow-400">
                  <Star className="w-4 h-4 fill-yellow-400" />
                  {current.rating}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-3 leading-tight">
              {current.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              <span>{current.year}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span className="capitalize">{current.genre}</span>
              {current.duration && (
                <>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{current.duration}</span>
                </>
              )}
              {current.seasons && (
                <>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                  <span>{current.seasons} Seasons</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-gray-300 mb-6 line-clamp-2 lg:line-clamp-3 max-w-xl">
              {current.description}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                href={`/watch/${current.id}`}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                Watch Now
              </Link>
              <Link
                href={`/watch/${current.id}`}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white font-medium hover:bg-white/20 transition-all border border-white/10"
              >
                <Info className="w-5 h-5" />
                More Info
              </Link>
              {onWatchlist && (
                <button
                  onClick={() => onWatchlist(current.id)}
                  className="p-3 rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all border border-white/10"
                >
                  <Bookmark className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-6 right-4 lg:right-8 flex items-center gap-2">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-8 bg-primary" : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
